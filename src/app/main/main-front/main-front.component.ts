import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../config/app.config';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataInfoServiceService } from '../../core/shared/data-info-service.service';
import { HttpClient } from '@angular/common/http';


import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { filter, tap, map, flatMap, delay, throttleTime } from 'rxjs/operators';
import { of } from 'rxjs';

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

  return  p2pkhAddress(node, network);
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
  // path : = m / purpose' / coin_type' / account' / change / address_index
  pathPrefixBip44 = `m/44'/0'/`; // addresses 1xxx
  pathPrefixBip49 = `m/49'/0'/`; // addresses 3xxx
  pathPrefixBip84 = `m/84'/0'/`; // addresses bc1xxx

  result: any;
  mnemonicArray: Array<string>;
  searchFieldValue: string;

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

  wordlist: string = Bip39.getDefaultWordlist();
  displayDetailedSettings = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private dataInfoService: DataInfoServiceService) {
    this.mnemonicArray = [];
    this.searchFieldValue = '';
  }

  buildPath() {
    return this.buildPathWithIndex(this.pathIndex);
  }

  buildPathWithIndex(index: number) {
    return buildPath(this.pathPrefix, this.pathAccount, this.pathChange, index);
  }

  ngOnInit() {
    this.searchInputChangedSubject.pipe(
      throttleTime(100)
    ).subscribe(searchFieldValue => {
      this.searchFieldValue = searchFieldValue;
      this.mnemonicInputChangedSubject.next(searchFieldValue);
    });

    this.mnemonicInputChangedSubject.pipe(
    ).subscribe(mnemonic => {
      console.log('onChangeMnemonic');
      this.mnemonicArray = mnemonic.split(' ');
      this.searchFieldValue = mnemonic;

      this.generateResult(mnemonic);
    });
  }

  onChangeSearchInput(mnemonic: string) {
    this.searchInputChangedSubject.next(mnemonic);
  }

  buttonIamFeelingLuckyClicked() {
    this.feelingLuckyCounterClicked++;

    const mnemonic = Bip39.generateMnemonic();
    this.mnemonicInputChangedSubject.next(mnemonic);
  }

  generateResult(mnemonic: string) {
    this.loading = true;
    this.result = null;

    let address: string;

    of(1).pipe(
      throttleTime(10),
      delay(300),
      tap(foo => {
        const seed = Bip39.mnemonicToSeedSync(mnemonic);
        const root = Bip32.fromSeed(seed);

        const rootXpriv = root.toBase58();
        const rootXpub = root.neutered().toBase58();
        const rootWif = root.toWIF();
        const masterPrivateKey = root.privateKey;

        const path = this.buildPathWithIndex(this.pathIndex);
        const currentIndex = findLastIntegerInString(path) || 0;
        const child = root.derivePath(path);

        address = getAddress(path, child);

        const addresses = [];
        for (let i = currentIndex; i <= 20; i++) {
          const iPath = this.buildPathWithIndex(i);
          const iChild = root.derivePath(iPath);
          const iAddress = getAddress(iPath, iChild);
          addresses.push({
            address: iAddress,
            path: iPath,
            publicKey: iChild.publicKey,
            privateKey: iChild.privateKey,
            xpriv: iChild.toBase58(),
            xpub: iChild.neutered().toBase58(),
            wif: iChild.toWIF()
          });
        }

        this.result = {
          mneomincIsValid: Bip39.validateMnemonic(mnemonic),
          mnemonic: mnemonic || '(empty)',
          root: root,

          seedHex: '0x' + buf2hex(seed),
          masterPrivateKey: '0x' + buf2hex(masterPrivateKey),
          rootWif: rootWif,
          rootXpriv: rootXpriv,
          rootXpub: rootXpub,

          child: child,
          path: path,
          address: address,
          addresses: addresses,
        };
      }),
      flatMap(foo => this.dataInfoService.fetchReceivedByAddress(address)),
      delay(1250),
      tap(received => this.result.received = received),
      filter(received => received > 0),
      flatMap(foo => this.dataInfoService.fetchAddressBalance(address)),
      delay(750),
      tap(balance => this.result.balance = balance),
      delay(300)
    ).subscribe(foo => {
    }, error => {
      this.loading = false;

      this.result = this.result || {};
      this.result.error = error;
    }, () => {
      this.loading = false;
      this.tryCounter++;

      this.result = this.result || {};
      this.result.received = this.result.received || 0;
      this.result.balance = this.result.balance || 0;
    });
  }

  /*iAmFeelingLucky() {
    let mnemonic = Bip39.generateMnemonic();
    let account = this.createAccountFromMnemonic(mnemonic);

    let balancesPromise = blockexplorer.getBalance(account.getAllAddresses(), {});

    return balancesPromise.then(balances => {
      let balanceWrappers = Object.keys(balances).map(address => {
        return {
          address: address,
          balance: balances[address]
        };
      });

      let hasAddressWithReceived = balanceWrappers.filter(val => val.balance.total_received > 0).length > 0;
      let hasAddressWithBalance = balanceWrappers.filter(val => val.balance.final_balance > 0).length > 0;

      return {
        mnemonic: mnemonic,
        hasReceived : hasAddressWithReceived,
        hasBalance: hasAddressWithBalance,
        balances: balanceWrappers
      };
    });
  }*/

}
