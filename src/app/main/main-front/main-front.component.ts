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
import { filter, tap, map, take, delay, throttleTime, takeWhile, takeLast, reduce, endWith, concatMap } from 'rxjs/operators';
import { of, from } from 'rxjs';

interface NgNode {
    root: Bip32.BIP32Interface;
    address: string;
    path: string;
    publicKey: string;
    privateKey: string;
    xpriv: string;
    xpub: string;
    wif: string;
    error: any;
    received: number;
    balance: number;
    lastCheckTimestamp: number; // last time the node was checked
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function p2pkhAddress(node: any, network?: any): string {
  return Bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}
function segwitAdddress(node: any, network?: any): string {
  return Bitcoin.payments.p2sh({
    redeem: Bitcoin.payments.p2wpkh({ pubkey: node.publicKey })
  }).address!;
}
function p2wpkhAddress(node: any, network?: any): string {
  return Bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address!;
}

function getAddress(path: string, node: Bip32.BIP32Interface, network?: any): string {
  if (path.substr(0, `m/44'/`.length) === `m/44'/`) {
    return p2pkhAddress(node, network);
  }
  if (path.substr(0, `m/49'/`.length) === `m/49'/`) {
    return segwitAdddress(node, network);
  }

  if (path.substr(0, `m/84'/`.length) === `m/84'/`) {
    return p2wpkhAddress(node, network);
  }

  return p2pkhAddress(node, network);
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

    of(1).pipe(
      map(foo => {
        const seed = Bip39.mnemonicToSeedSync(mnemonic, this.passphraseInputValue);
        const root = Bip32.fromSeed(seed);

        const rootXpriv = root.toBase58();
        const rootXpub = root.neutered().toBase58();
        const rootWif = root.toWIF();
        const masterPrivateKey = root.privateKey;

        const path = this.buildPathWithIndex(this.pathIndex);
        const currentIndex = findLastIntegerInString(path) || 0;

        const addresses: NgNode[] = [];
        for (let i = currentIndex; i <= 20; i++) {
          const iPath = this.buildPathWithIndex(i);
          const iChild = root.derivePath(iPath);
          const iAddress = getAddress(iPath, iChild);

          const addressResult = {
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
      concatMap(result => from(result.addresses as NgNode[]).pipe(
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
      concatMap(result => from(result.addresses as NgNode[]).pipe(
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
      concatMap(result => from(result.addresses as NgNode[]).pipe(
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
    });
  }

}
