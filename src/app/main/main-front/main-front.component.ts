import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../config/app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataInfoServiceService } from '../../core/shared/data-info-service.service';
import { HttpClient } from '@angular/common/http';

import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { filter, tap, map, take, defaultIfEmpty, first, throttleTime, takeWhile, takeLast, 
  reduce, endWith, concatMap, catchError } from 'rxjs/operators';
import { Observable, of, from, forkJoin, onErrorResumeNext } from 'rxjs';
import { pathToFileURL } from 'url';
import { TagContentType } from '@angular/compiler';
import { onErrorResumeNextStatic } from 'rxjs/internal/operators/onErrorResumeNext';

type Timestamp = number;
type HexString = string;
type Mnemonic = string;
type BitcoinAddress = string;
type Satoshi = number;
type Bip39Path = string;

function isValidBip32Path(value: string): boolean {
  return value.match(/^(m\/)?(\d+'?\/)*\d+'?$/) !== null;
}

interface NgBip32HdNodeLegacy {
  readonly root: Bip32.BIP32Interface;
  readonly path: Bip39Path;
  readonly publicKey: HexString;
  readonly privateKey: HexString;
  readonly xpriv: string;
  readonly xpub: string;
  readonly wif: string;

  readonly address: BitcoinAddress;

  received?: Satoshi;
  balance?: Satoshi;
  lastCheckTimestamp?: Timestamp;
  error?: Error;
}

interface NgBip32HdAddress {
  readonly address: BitcoinAddress;
}

class NgBip32HdAddressView {
  received?: Satoshi;
  balance?: Satoshi;
  lastCheckTimestamp?: Timestamp;
  error?: Error;

  constructor(public readonly _address: NgBip32HdAddress) {

  }

  /*

  balance() {
    return this._balance !== undefined ?
      of(this._balance) :
      this.dataInfoService.fetchAddressBalance(this._address.address).pipe(
        tap(val => this._balance = val as Satoshi),
        tap(x => this.lastCheckTimestamp = new Date().getTime())
      )
  }

  received() {
    return this._received !== undefined ?
      of(this._received) :
      this.dataInfoService.fetchReceivedByAddress(this._address.address).pipe(
        tap(val => this._received = val as Satoshi),
        tap(x => this.lastCheckTimestamp = new Date().getTime())
      )
  }*/
}

interface NgBip32HdNode {
    readonly _self: Bip32.BIP32Interface;

    readonly path: Bip39Path;
    readonly publicKey: HexString;
    readonly privateKey: HexString;
    readonly xpriv: string;
    readonly xpub: string;
    readonly wif: string;

    readonly addresses: NgBip32HdAddress[];

    readonly childNodes: NgBip32HdNode[];
}


function _newNodeInternal(node: Bip32.BIP32Interface, path: Bip39Path): NgBip32HdNode {
  console.log('create new node with path ' + path);
  return {
    _self: node,
    path: path,
    publicKey: '0x' + buf2hex(node.publicKey),
    privateKey: '0x' + buf2hex(node.privateKey),
    xpriv: node.toBase58(),
    xpub: node.neutered().toBase58(),
    wif: node.toWIF(),
    addresses: [ {
        address: p2pkhAddress(node)
      }, {
        address: segwitAdddress(node)
      }, {
        address: p2wpkhAddress(node)
      }
    ],
    childNodes: []
  };
}

/*
function _newNodeViewInternal(node: Bip32.BIP32Interface, path: Bip39Path): NgBip32HdNodeView {
  return new NgBip32HdNodeView(_newNodeInternal(node, path));
}*/

class NgBip32HdNodeView {
  public readonly addresses: NgBip32HdAddressView[];
  public childNodes: NgBip32HdNodeView[];

  constructor(private readonly _root, public readonly _node: NgBip32HdNode) {
    this.addresses = _node.addresses.map(it => new NgBip32HdAddressView(it));
    this.childNodes = _node.childNodes.map(it => new NgBip32HdNodeView(_root, it));
  }

  errors(): Error[] {
    return this.addresses.filter(it => !!it.error).map(it => it.error);
  }

  balance(): Satoshi {
    const selfBalance = this.addresses.map(it => it.balance).reduce((prev, curr) => prev + curr, 0);
    const nodesBlanace = this.childNodes.map(it => it.balance()).reduce((prev, curr) => prev + curr, 0);
    return selfBalance + nodesBlanace;
  }

  received(): Satoshi {
    const selfReceived = this.addresses.map(it => it.received).reduce((prev, curr) => prev + curr, 0);
    const nodesReceived = this.childNodes.map(it => it.received()).reduce((prev, curr) => prev + curr, 0);
    return selfReceived + nodesReceived;
  }

  public hasNodeWithPath(path: Bip39Path): boolean {
    return this.findNodeByPath(path) !== undefined;
  }

  private findNodeByPath(path: Bip39Path): NgBip32HdNodeView | undefined {
    const nodes = this.childNodes
      .filter(it => it._node.path === path);

    return nodes.length > 0 ? nodes[0] : undefined;
  }

  _getOrCreateBySubpath(subpath: Bip39Path): NgBip32HdNodeView {
    const fullpath = `${this._node.path}/${subpath}`;
    if (this.hasNodeWithPath(fullpath)) {
      return this.findNodeByPath(fullpath);
    }

    const child: Bip32.BIP32Interface = this._root.derivePath(fullpath);
    const newNode = _newNodeInternal(child, fullpath);

    this._node.childNodes.push(newNode);
    this.childNodes.push(new NgBip32HdNodeView(this._root, newNode));

    return this.findNodeByPath(fullpath);
  }

  public getOrCreateIndex(index: number): NgBip32HdNodeView {
    return this._getOrCreateBySubpath(`${index}`);
  }

  public getOrCreateIndexRange(offet: number, amount: number = 20): NgBip32HdNodeView[] {
    return Array.from(Array(amount).keys())
      .map(val => val + offet)
      .map(index => this.getOrCreateIndex(index));
  }

  public getOrCreateNextIndex(): NgBip32HdNodeView {
    if (this.childNodes.length === 0) {
      return this.getOrCreateIndex(0);
    }

    const lastChildNode = this.childNodes[this.childNodes.length - 1];
    const currentIndex = findLastIntegerInString(lastChildNode._node.path);
    return this.getOrCreateIndex(currentIndex + 1);
  }

  public scanAddressesBalances(dataInfoService: DataInfoServiceService): Observable<NgBip32HdNodeView>  {
    return this._scanAddressesBalancesRecursive(dataInfoService, this);
  }

  private _scanAddressesBalancesRecursive(dataInfoService: DataInfoServiceService,
                                          nodeView: NgBip32HdNodeView): Observable<NgBip32HdNodeView> {
    return of(nodeView).pipe(
      tap(node => console.log(`1 now fetching for ${node._node.path}`)),
      concatMap(node => from(node.addresses).pipe(
        tap(addressView => console.log(`fetchReceivedByAddress for ${node._node.path} and address ${addressView._address.address}`)),
        concatMap(addressView => dataInfoService.fetchReceivedByAddress(addressView._address.address).pipe(
          tap(
            received => addressView.received = received as Satoshi,
            error => addressView.error = error,
            () => addressView.lastCheckTimestamp = new Date().getTime()
          ),
          tap(received => {
            console.log(`${node._node.path} and address ${addressView._address.address} received ${received}`);
          }, error => console.log(`error while scanning ${node._node.path}: ${error}`)),
        )),
        map(addressView => node),
        endWith(nodeView),
      )),
      takeLast(1),
      tap(node => console.log(`2 now fetching for ${node._node.path}`)),
      concatMap(node => from(node.addresses).pipe(
        tap(addressView => addressView.balance = addressView.received === 0 ? 0 : null),
        filter(addressView => addressView.received > 0),
        tap(addressView => console.log(`fetchAddressBalance for ${node._node.path} and address ${addressView._address.address}`)),
        concatMap(addressView => dataInfoService.fetchAddressBalance(addressView._address.address).pipe(
          tap(balance => {
            addressView.balance = balance as Satoshi;
            addressView.lastCheckTimestamp = new Date().getTime();
          }, error => addressView.error = error),
          tap(balance => {
            console.log(`${node._node.path} and address ${addressView._address.address} balance ${balance}`);
          }, error => console.log(`error while scanning ${node._node.path}: ${error}`)),
        )),
        map(addressView => node),
        endWith(nodeView),
      )),
      takeLast(1),
      tap(node => console.log(`3 now fetching for ${node._node.path}`)),
      concatMap(node => forkJoin([
        of(node),
        from(node.childNodes).pipe(
          tap(childNode => console.log(`scaaaaaaaaaning ${childNode._node.path} has balance := ${childNode.received()}`)),
          concatMap(childNode => this._scanAddressesBalancesRecursive(dataInfoService, childNode)),
          tap(childNode => console.log(`------------------ after scanning ${childNode._node.path} has balance := ${childNode.received()}`)),
          takeWhile(childNode => childNode.received() > 0),
          // first(childNode => (childNode.received() === 0)),
        )
      ])),
      map(([parent, ]) => parent)
    );
  }

}
class NgBip32HdRootView {
  public readonly root: NgBip32HdNodeView;
  private readonly seed: Buffer;

  constructor(public readonly mnemonic: Mnemonic,
      private readonly passphrase?,
      private readonly dataInfoService?: DataInfoServiceService) {
    this.seed = Bip39.mnemonicToSeedSync(mnemonic, passphrase);

    const rootNode = Bip32.fromSeed(this.seed);
    this.root = new NgBip32HdNodeView(rootNode, _newNodeInternal(rootNode, 'm'));
  }

  hasValidMnemonic(): boolean {
    return Bip39.validateMnemonic(this.mnemonic);
  }

  get(path: Bip39Path): NgBip32HdNodeView {
    if (!isValidBip32Path(path)) {
      throw new Error('invalid bip32 path');
    }

    return this.root._getOrCreateBySubpath(path.substr(2, path.length));
  }

  scanAddressesBalances() {
    return this.root.scanAddressesBalances(this.dataInfoService);
  }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function p2pkhAddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}
function segwitAdddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2sh({
    redeem: Bitcoin.payments.p2wpkh({ pubkey: node.publicKey })
  }).address!;
}
function p2wpkhAddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address!;
}
function generateAddressFn(path: string, defaultFn?: (node, network?) => BitcoinAddress): (node, network?) => BitcoinAddress {
  if (path.substr(0, `m/44'/`.length) === `m/44'/`) {
    return p2pkhAddress;
  }
  if (path.substr(0, `m/49'/`.length) === `m/49'/`) {
    return segwitAdddress;
  }

  if (path.substr(0, `m/84'/`.length) === `m/84'/`) {
    return p2wpkhAddress;
  }

  return defaultFn ? defaultFn : p2pkhAddress;
}

function buildPath(prefix: string, account: number, change: number, index: number) {
  if (prefix && Number.isInteger(account) &&  Number.isInteger(change) && Number.isInteger(index)) {
    return `${prefix}${account}'/${change}/${index}`;
  }
  if (prefix && Number.isInteger(account) &&  Number.isInteger(change)) {
    return `${prefix}${account}'/${change}`;
  }
  if (prefix && Number.isInteger(account)) {
    return `${prefix}${account}'`;
  }
  if (prefix && Number.isInteger(index)) {
    return `${prefix}${index}`;
  }
  return `${prefix}`;
}

function findLastIntegerInString(val: string): number | null {
  const match = val.match(/(\d+)(?!.*\d)/);
  if (match.length === 2) {
    return Number.parseInt(match[1], 10);
  }
  return null;
}


@Component({
  selector: 'app-main-front',
  templateUrl: './main-front.component.html',
  styleUrls: ['./main-front.component.scss']
})

export class MainFrontComponent implements OnInit {
  private SEARCH_QUERY_PARAM_NAME = 'q';
  private PASSPHRASE_QUERY_PARAM_NAME = 'p';

  // path : = m / purpose' / coin_type' / account' / change / address_index
  private pathPrefixBip44 = `m/44'/0'/`; // addresses 1xxx
  private pathPrefixBip49 = `m/49'/0'/`; // addresses 3xxx
  private pathPrefixBip84 = `m/84'/0'/`; // addresses bc1xxx

  result: any;
  wallet: NgBip32HdRootView;

  mnemonicArray: Array<string>;
  searchInputValue: string;
  passphraseInputValue: string;

  pathAccount = 0;
  pathChange = 0;
  pathIndex = 0;

  pathPrefix = `${this.pathPrefixBip44}`;

  pathPrefixInputAutocompleteOptions = [{
      value: this.pathPrefixBip44,
      name: this.pathPrefixBip44 + ' (BIP44)'
    }, {
      value: this.pathPrefixBip49,
      name: this.pathPrefixBip49 + ' (BIP49)'
    }, {
      value: this.pathPrefixBip84,
      name: this.pathPrefixBip84 + ' (BIP84)'
    }
  ];

  mnemonicInputChangedSubject: Subject<string> = new Subject<string>();
  searchInputChangedSubject: Subject<string> = new Subject<string>();

  tryCounter = 0;
  feelingLuckyCounterClicked = 0;
  loading = false;

  displayDetailedSettings = false;
  addressesDisplayedColumns = ['info', 'received', 'balance']; // ['path', 'address', 'wif', 'received', 'balance', 'lastCheckedTimestamp'];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataInfoService: DataInfoServiceService) {
    this.mnemonicArray = [];
    this.searchInputValue = '';
    this.passphraseInputValue = '';
  }

  buildPath() {
    return this.buildPathWithIndex(this.pathIndex);
  }

  buildPathWithIndex(index: number) {
    return buildPath(this.pathPrefix, this.pathAccount, this.pathChange, index);
  }

  ngOnInit() {
    this.mnemonicInputChangedSubject.pipe(
    ).subscribe(mnemonic => {
      console.log('onChangeMnemonic');
      this.mnemonicArray = mnemonic.split(' ');
      this.searchInputValue = mnemonic;

      this.generateResult(mnemonic);
    });

    this.searchInputChangedSubject.pipe(
      filter(val => val !== null),
      throttleTime(100)
    ).subscribe(searchFieldValue => {
      this.searchInputValue = searchFieldValue;
      this.mnemonicInputChangedSubject.next(searchFieldValue);
    });

    this.activatedRoute.queryParamMap.pipe(
    ).subscribe(p => {
      this.passphraseInputValue = p.get(this.PASSPHRASE_QUERY_PARAM_NAME);
    });

    this.activatedRoute.queryParamMap.pipe(
      take(1)
    ).subscribe(p => {
      const mnemonic = p.get(this.SEARCH_QUERY_PARAM_NAME);
      this.searchInputChangedSubject.next(mnemonic);
    });
  }

  onChangeSearchInput(mnemonic: string) {
    const queryParams = {};
    queryParams[this.SEARCH_QUERY_PARAM_NAME] = mnemonic;
    queryParams[this.PASSPHRASE_QUERY_PARAM_NAME] = this.passphraseInputValue;
    queryParams['ts'] = Date.now();

    // add query params but do not reload page (default if same page)
    this.router.navigate([''], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });

    // trigger search input update
    this.searchInputChangedSubject.next(mnemonic);
  }

  buttonSearchClicked() {
    this.onChangeSearchInput(this.searchInputValue);
  }

  buttonIamFeelingLuckyClicked() {
    this.feelingLuckyCounterClicked++;

    const mnemonic = Bip39.generateMnemonic();
    this.onChangeSearchInput(mnemonic);
  }

  generateResult(mnemonic: string) {
    this.loading = true;
    this.result = null;
    this.wallet = null;

    of(1).pipe(
      map(foo => {
        const wallet = new NgBip32HdRootView(mnemonic, this.passphraseInputValue, this.dataInfoService);

        // private pathPrefixBip44 = `m/44'/0'/`; // addresses 1xxx
        // private pathPrefixBip49 = `m/49'/0'/`; // addresses 3xxx
        // private pathPrefixBip84 = `m/84'/0'/`; // addresses bc1xxx

        // wallet.get(`m/0/0/0`);
        // wallet.get(`m/44'/0'`);
        // wallet.get(`m/49'/0'`);
        // wallet.get(`m/84'/0'`);

        for (let i = 0; i < 7; i++) {
          // wallet.get(`m/44'/0'/0'/0`).getIndex(i);
          // wallet.get(`m/49'/0'/0'/0`).getIndex(i);
          wallet.get(`m/84'/0'/0'/0`).getOrCreateNextIndex();
        }

        return wallet;
      }),
      concatMap(result => result.scanAddressesBalances().pipe(
        map(x => result),
        endWith(result)
      )),
      takeLast(1),
    ).subscribe(result => {
      console.log('wallet created');
      this.wallet = result;
    }, error => {
      console.log('wallet error');
    }, () => {
      console.log('wallet finished');
    });

    /*of(1).pipe(
      map(foo => {
        const seed = Bip39.mnemonicToSeedSync(mnemonic, this.passphraseInputValue);
        const root = Bip32.fromSeed(seed);

        const rootXpriv = root.toBase58();
        const rootXpub = root.neutered().toBase58();
        const rootWif = root.toWIF();
        const masterPrivateKey = root.privateKey;

        const path = this.buildPathWithIndex(this.pathIndex);
        const currentIndex = findLastIntegerInString(path) || 0;

        const addresses: NgBip32HdNodeLegacy[] = [];
        for (let i = currentIndex; i <= 20; i++) {
          const iPath = this.buildPathWithIndex(i);
          const iChild = root.derivePath(iPath);
          const iAddress = generateAddressFn(iPath)(iChild);

          const addressResult: NgBip32HdNodeLegacy = {
            root: iChild,
            address: iAddress,
            path: iPath,
            publicKey: '0x' + buf2hex(iChild.publicKey),
            privateKey: '0x' + buf2hex(iChild.privateKey),
            xpriv: iChild.toBase58(),
            xpub: iChild.neutered().toBase58(),
            wif: iChild.toWIF(),
            error: null,
            received: 0,
            balance: 0,
            lastCheckTimestamp: null,
          };
          addresses.push(addressResult);
        }

        const result = {
          mneomincIsValid: Bip39.validateMnemonic(mnemonic),
          mnemonic: mnemonic || '(empty)',
          root: root,

          seedHex: '0x' + buf2hex(seed),
          masterPrivateKey: '0x' + buf2hex(masterPrivateKey),
          rootWif: rootWif,
          rootXpriv: rootXpriv,
          rootXpub: rootXpub,

          address: addresses.length > 0 ? addresses[0].address : null,
          addresses: addresses,

          balance: null,
          received: null
        };

        return result;
      }),
      tap(result => this.result = result),
      delay(300),
      // fetch addresses balances and received by until reveived <= 0
      concatMap(result => from(result.addresses as NgBip32HdNodeLegacy[]).pipe(
          concatMap(val => this.dataInfoService.fetchReceivedByAddress(val.address).pipe(
            tap(received => val.received = received),
            tap(x => val.lastCheckTimestamp = new Date().getTime()),
            map(x => val)
          )),
          takeWhile(val => val.received > 0),
          tap(val => console.log('take ' + val.address + ' because reveiced > 0: ' + val.received)),
          concatMap(val => this.dataInfoService.fetchAddressBalance(val.address).pipe(
            tap(balance => val.balance = balance),
            map(x => val)
          )),
          map(x => result),
          endWith(result)
        )),
      takeLast(1),
      concatMap(result => from(result.addresses as NgBip32HdNodeLegacy[]).pipe(
        filter(val => val.received > 0),
        map(val => val.received),
        reduce((acc, curr) => acc + curr, 0),
        tap(totalReceived => result.received = totalReceived),
        map(x => result),
        endWith(result)
      )),
      takeLast(1),
      tap(result => this.result = result),
      delay(1300),
      concatMap(result => from(result.addresses as NgBip32HdNodeLegacy[]).pipe(
        filter(val => val.balance > 0),
        map(val => val.balance),
        reduce((acc, curr) => acc + curr, 0),
        tap(totalBalance => result.balance = totalBalance),
        map(x => result),
        endWith(result)
      )),
      takeLast(1),
    ).subscribe(result => {
      this.result = result;
      console.log('subscribe');
    }, error => {
      this.loading = false;

      this.result = this.result || {};
      this.result.error = error;
      console.log('error');
    }, () => {
      this.loading = false;
      this.tryCounter++;

      this.result = this.result || {};
      console.log('end');
    });*/
  }

}
