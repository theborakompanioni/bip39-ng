import { Injector, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../config/app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataInfoServiceService } from '../../core/shared/data-info-service.service';
import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { filter, tap, map, take, defaultIfEmpty, first, last, throttleTime, takeWhile, takeLast,
  reduce, endWith, concatMap, catchError, flatMap } from 'rxjs/operators';
import { Observable, concat, of, from, forkJoin, onErrorResumeNext } from 'rxjs';
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
  const defaultAddressGenerationFun = (n, network) => [
    p2pkhAddress(n, network),
    segwitAdddress(n, network),
    p2wpkhAddress(n, network)
  ];

  return _newNodeInternalWithAddressGenerationStrategy(node, path, (n, p) => {
    const addresses  = generateAddressArrayFn(p, defaultAddressGenerationFun)(n, n.network);

    return addresses.map(val => {
      return {
        address: val
      };
    });
  });
}

type AddressGenerationStrategy = (node: Bip32.BIP32Interface, path: Bip39Path) => NgBip32HdAddress[];
function _newNodeInternalWithAddressGenerationStrategy(node: Bip32.BIP32Interface,
   path: Bip39Path,
   addressGen: AddressGenerationStrategy): NgBip32HdNode {
  console.log('create new node with path ' + path);
  return {
    _self: node,
    path: path,
    publicKey: '0x' + buf2hex(node.publicKey),
    privateKey: '0x' + buf2hex(node.privateKey),
    xpriv: node.toBase58(),
    xpub: node.neutered().toBase58(),
    wif: node.toWIF(),
    addresses: addressGen(node, path),
    childNodes: []
  };
}

/*
function _newNodeViewInternal(node: Bip32.BIP32Interface, path: Bip39Path): NgBip32HdNodeView {
  return new NgBip32HdNodeView(_newNodeInternal(node, path));
}*/
type ContinueScanningPredicate = (value: NgBip32HdNodeView, index: number) => boolean;

class NgBip32HdNodeView {
  public readonly addresses: NgBip32HdAddressView[];
  public childNodes: NgBip32HdNodeView[];

  constructor(private readonly _root: Bip32.BIP32Interface, public readonly _node: NgBip32HdNode) {
    this.addresses = _node.addresses.map(it => new NgBip32HdAddressView(it));
    this.childNodes = _node.childNodes.map(it => new NgBip32HdNodeView(_root, it));
  }

  errors(): Error[] {
    return this.addresses.filter(it => !!it.error).map(it => it.error);
  }

  selfBalance(): Satoshi {
    return this.addresses
      .map(it => it.balance)
      .filter(val => !!val)
      .reduce((prev, curr) => prev + curr, 0);
  }

  nodesBlanace(): Satoshi {
    return this.childNodes
    .map(it => it.balance())
    .reduce((prev, curr) => prev + curr, 0);
  }

  balance(): Satoshi {
    const selfBalance = this.addresses
      .map(it => it.balance)
      .filter(val => !!val)
      .reduce((prev, curr) => prev + curr, 0);

    const nodesBlanace = this.childNodes
      .map(it => it.balance())
      .reduce((prev, curr) => prev + curr, 0);

    return this.selfBalance() + this.nodesBlanace();
  }

  selfReceived() {
    return this.addresses
      .map(it => it.received)
      .filter(val => !!val)
      .reduce((prev, curr) => prev + curr, 0);
  }

  nodesReceived(): Satoshi {
    return this.childNodes
      .map(it => it.received())
      .reduce((prev, curr) => prev + curr, 0);
  }

  received(): Satoshi {
    return this.selfReceived() + this.nodesReceived();
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

}

@Pipe({
    name: 'bitcoin'
})
export class BitcoinPipe implements PipeTransform {
  private readonly currencyPipe: CurrencyPipe;

  constructor (injector: Injector) {
    this.currencyPipe = injector.get(CurrencyPipe);
  }

  transform(value: number, valueType?: string, displayType?: string): string {
    const _valueType = valueType && valueType === 'btc' ? 'btc' : 'sat';
    const _displayType = displayType && displayType === 'sat' ? 'sat' : 'btc';

    const displayBitcoin = _displayType === 'btc';

    const isSatToBtc = _valueType === 'sat' && _displayType === 'btc';
    const isBtcToSat = _valueType === 'btc' && _displayType === 'sat';

    let _value = value;
    if (isSatToBtc) {
      _value = value / 100_000_000;
    }
    if (isBtcToSat) {
      _value = value / 100_000_000;
    }

    const symbol = displayBitcoin ? '₿' : 'sat';
    const digitInfo = displayBitcoin ? '1.0-8' : '1.0-0';
    return this.currencyPipe.transform(_value, 'XBT', symbol, digitInfo);
  }
}

class NgBip32HdWalletView {
  public readonly root: NgBip32HdNodeView;
  private readonly seed: Buffer;

  constructor(public readonly mnemonic: Mnemonic, passphrase?,
              private readonly network: Bitcoin.Network = Bitcoin.networks.bitcoin,
              private readonly dataInfoService?: DataInfoServiceService) {
    this.seed = Bip39.mnemonicToSeedSync(mnemonic, passphrase);

    const rootNode = Bip32.fromSeed(this.seed, this.network);
    this.root = new NgBip32HdNodeView(rootNode, _newNodeInternal(rootNode, 'm'));
  }

  hasValidMnemonic(): boolean {
    return Bip39.validateMnemonic(this.mnemonic);
  }

  getOrCreateNode(path: Bip39Path): NgBip32HdNodeView {
    if (!isValidBip32Path(path)) {
      throw new Error('invalid bip32 path');
    }

    return this.root._getOrCreateBySubpath(path.substr(2, path.length));
  }

  public scanNextChildNode(node: NgBip32HdNodeView) {
    this.scanBalanceOfNode(node.getOrCreateNextIndex())
      .subscribe();
  }

  public findNodesWithBalanceGreaterZero(): NgBip32HdNodeView[] {
    return this.findNodesRecursive(this.root, (node) => node.selfBalance() > 0);
  }

  private findNodesWithReceivedGreaterZero(): NgBip32HdNodeView[] {
    return this.findNodesRecursive(this.root, (node) => node.selfReceived() > 0);
  }

  private findNodesRecursive(node: NgBip32HdNodeView, predicate: (node: NgBip32HdNodeView) => boolean): NgBip32HdNodeView[] {
    const nodesWithBalance = node.childNodes
      .map(childNode => this.findNodesRecursive(childNode, predicate))
      .reduce((prev, curr) => prev.concat(curr), []);

    return (predicate(node) ? [node] : []).concat(nodesWithBalance);
  }

  public scanBalances(): Observable<NgBip32HdNodeView>  {
    return this._scanAddressesBalancesRecursiveWithPredicate(this.dataInfoService, this.root, childNode => true);
  }

  public scanBalanceOfNode(nodeView: NgBip32HdNodeView): Observable<NgBip32HdNodeView>  {
    return this._scanAddressesBalancesRecursiveWithPredicate(this.dataInfoService, nodeView, childNode => true);
  }

  private _scanAddressesBalancesRecursive(dataInfoService: DataInfoServiceService,
                                          nodeView: NgBip32HdNodeView): Observable<NgBip32HdNodeView> {
      return this._scanAddressesBalancesRecursiveWithPredicate(dataInfoService, nodeView, childNode => childNode.received() > 0);
  }

  private _scanAddressesBalancesRecursiveWithPredicate(dataInfoService: DataInfoServiceService,
                                          nodeView: NgBip32HdNodeView,
                                          predicate: ContinueScanningPredicate): Observable<NgBip32HdNodeView> {

    const recursiveScanOfChildNodes = from(nodeView.childNodes).pipe(
        concatMap(childNode => this._scanAddressesBalancesRecursive(dataInfoService, childNode)),
        takeWhile(predicate),
        endWith(nodeView),
        last()
    );

    const options = {
      testnet: nodeView._node._self.network === Bitcoin.networks.testnet
    };

    const selfScan = of(nodeView).pipe(
      tap(node => console.log(`start fetching for path ${node._node.path}`)),
      concatMap(node => from(node.addresses).pipe(
        tap(addressView => console.log(`fetchReceivedByAddress for ${node._node.path} and address ${addressView._address.address}`)),
        concatMap(addressView => dataInfoService.fetchReceivedByAddress(addressView._address.address, options).pipe(
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
      )),
      last(),
      concatMap(node => from(node.addresses).pipe(
        tap(addressView => addressView.balance = addressView.received === 0 ? 0 : null),
        filter(addressView => addressView.received > 0),
        tap(addressView => console.log(`fetchAddressBalance for ${node._node.path} and address ${addressView._address.address}`)),
        concatMap(addressView => dataInfoService.fetchAddressBalance(addressView._address.address, options).pipe(
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
      last(),
      tap(node => console.log(`end fetching for path ${node._node.path} (received: ${node.received()}, balance: ${node.balance()})`)),
    );

    return concat(recursiveScanOfChildNodes, selfScan).pipe(
      last()
    );
  }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function p2pkhAddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2pkh({ pubkey: node.publicKey, network: network }).address!;
}

function segwitAdddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2sh({
    redeem: Bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: network }),
    network: network
  }).address!;
}

function p2wpkhAddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: network }).address!;
}

function generateAddressArrayFn(path: string, defaultFn?: (node, network?) => BitcoinAddress[]): (node, network?) => BitcoinAddress[] {
  if (path.substr(0, `m/44'/`.length) === `m/44'/`) {
    return (node, network?) => [p2pkhAddress(node, network)];
  }
  if (path.substr(0, `m/49'/`.length) === `m/49'/`) {
    return (node, network?) => [segwitAdddress(node, network)];
  }

  if (path.substr(0, `m/84'/`.length) === `m/84'/`) {
    return (node, network?) => [p2wpkhAddress(node, network)];
  }

  return defaultFn ? defaultFn : (node, network?) => [p2wpkhAddress(node, network)];
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
  private readonly SEARCH_QUERY_PARAM_NAME = 'q';
  private readonly PASSPHRASE_QUERY_PARAM_NAME = 'p';

  // path : = m / purpose' / coin_type' / account' / change / address_index
  private readonly pathPrefixBip44 = `m/44'/0'/`; // addresses 1xxx
  private readonly pathPrefixBip49 = `m/49'/0'/`; // addresses 3xxx
  private readonly pathPrefixBip84 = `m/84'/0'/`; // addresses bc1xxx

  result: any;
  wallet: NgBip32HdWalletView;

  mnemonicArray: Array<string>;
  searchInputValue: string;
  passphraseInputValue: string;
  networkInputValue: Bitcoin.Network = Bitcoin.networks.bitcoin;

  readonly networkInputSelectOptions = [{
    value: Bitcoin.networks.bitcoin,
    name: `mainnet`
  }, {
    value: Bitcoin.networks.testnet,
    name: `testnet`
  }
];


  pathAccount = 0;
  pathChange = 0;
  pathIndex = 0;

  pathPrefix = `${this.pathPrefixBip44}`;

  readonly pathPrefixInputAutocompleteOptions = [{
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
  readonly addressesDisplayedColumns = ['info', 'received', 'balance'];
  // ['path', 'address', 'wif', 'received', 'balance', 'lastCheckedTimestamp'];

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
        const wallet = new NgBip32HdWalletView(mnemonic, this.passphraseInputValue, this.networkInputValue, this.dataInfoService);

        // private pathPrefixBip44 = `m/44'/0'/`; // addresses 1xxx
        // private pathPrefixBip49 = `m/49'/0'/`; // addresses 3xxx
        // private pathPrefixBip84 = `m/84'/0'/`; // addresses bc1xxx

        for (let i = 0; i < 3; i++) {
          // see https://github.com/dan-da/hd-wallet-derive/blob/master/doc/wallet-bip32-path-presets.md
          wallet.getOrCreateNode(`m/44'/0'/0'/0`).getOrCreateNextIndex();
          // wallet.getOrCreateNode(`m/44'/0'/0'/1`).getOrCreateNextIndex();
          wallet.getOrCreateNode(`m/49'/0'/0'/0`).getOrCreateNextIndex();
          // wallet.getOrCreateNode(`m/49'/0'/0'/1`).getOrCreateNextIndex();
          wallet.getOrCreateNode(`m/84'/0'/0'/0`).getOrCreateNextIndex();
          // wallet.getOrCreateNode(`m/84'/0'/0'/1`).getOrCreateNextIndex();
          wallet.getOrCreateNode(`m/0'/0`).getOrCreateNextIndex();
          wallet.getOrCreateNode(`m/0`).getOrCreateNextIndex();
        }

        return wallet;
      }),
      concatMap(wallet => wallet.scanBalances().pipe(
        map(x => wallet),
        endWith(wallet),
        takeLast(1),
      )),
      // add all "change" accounts if "default node"s received is > 0
      concatMap(wallet => from(wallet.root.childNodes).pipe(
        filter(node => node.received() > 0),
        filter(node => node._node.path.match(/(\/0)$/).length > 0),
        map(node => node._node.path.replace(/(\/0)$/, '/1')),
        map(path => wallet.getOrCreateNode(path).getOrCreateNextIndex()),
        flatMap(changeNode => wallet.scanBalanceOfNode(changeNode)),
        map(x => wallet),
        endWith(wallet),
        takeLast(1),
      ))
    ).subscribe(wallet => {
      console.log('wallet created');
      this.wallet = wallet;

      // TODO: remove after feature is finished (only for debugging purposes)
      window['wallet'] = wallet;
    }, error => {
      this.loading = false;
      console.error(error);
    }, () => {
      this.loading = false;
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
