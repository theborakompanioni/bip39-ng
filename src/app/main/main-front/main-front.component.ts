import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../config/app.config';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { BlockchainInfoServiceService } from '../../core/shared/blockchain-info-service.service';
import { HttpClient } from '@angular/common/http';


import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { filter, tap, map, flatMap, delay, throttleTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}


function getAddress(node: any, network?: any): string {
  return Bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}

@Component({
  selector: 'app-main-front',
  templateUrl: './main-front.component.html',
  styleUrls: ['./main-front.component.scss']
})

export class MainFrontComponent implements OnInit {

  result: any;
  mnemonicArray: Array<string>;
  searchFieldValue: string;

  mnemonicInputChangedSubject: Subject<string> = new Subject<string>();
  searchInputChangedSubject: Subject<string> = new Subject<string>();

  tryCounter = 0;
  feelingLuckyCounterClicked = 0;
  loading = false;

  wordlist: string = Bip39.getDefaultWordlist();

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private blockchainInfo: BlockchainInfoServiceService) {
    this.mnemonicArray = [];
    this.searchFieldValue = '';
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

    // see BIP44 for why this path was chosen
    // @link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki 
    const pathBip44 = `m/44'/0'/0'/0/0`; // legacy addresses 1xxx
    const pathBip49 = `m/49'/0'/0'/0/0`; // legacy addresses 3xxx
    const pathBip84 = `m/84'/0'/0'/0/0`; // legacy addresses bc1xxx

    const seed = Bip39.mnemonicToSeedSync(mnemonic);
    const root = Bip32.fromSeed(seed);

    const childBip44 = root.derivePath(pathBip44);
    const address = getAddress(childBip44);

    of(1).pipe(
      throttleTime(10),
      delay(300),
      tap(foo => {
        this.result = {
          mnemonic: mnemonic || '(empty)',
          seedHex: '0x' + buf2hex(seed),
          address: address,
        };
      }),
      flatMap(foo => this.blockchainInfo.fetchReceivedByAddress(address)),
      delay(1250),
      tap(received => this.result.received = received),
      filter(received => received > 0),
      flatMap(foo => this.blockchainInfo.fetchAddressBalance(address)),
      delay(750),
      tap(balance => this.result.balance = balance),
      delay(300)
    ).subscribe(foo => {
    }, error => {
      this.loading = false;
      this.result.error = error;
    }, () => {
      this.loading = false;
      this.tryCounter++;

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
