import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../config/app.config';
import { Router } from '@angular/router';
import { BlockchainInfoServiceService } from '../../core/shared/blockchain-info-service.service';
import { HttpClient } from '@angular/common/http';


import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { filter, tap, map, flatMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';


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
  mnemonicArray: Array<String>;

  tryCounter = 0;
  loading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private blockchainInfo: BlockchainInfoServiceService) {
    this.mnemonicArray = [];
  }

  ngOnInit() {
  }

  generateNewRandomMnemonic() {
    const mnemonic = Bip39.generateMnemonic();
    this.mnemonicArray = mnemonic.split(' ');
    return mnemonic;
  }

  onChangeMnemonic() {
    const mnemonic = this.mnemonicArray.join(' ');

    this.generateResult(mnemonic);
  }

  buttonIamFeelingLuckyClicked() {
    const mnemonic = this.generateNewRandomMnemonic();

    this.generateResult(mnemonic);
  }

  generateResult(mnemonic: string) {
    this.loading = true;
    this.result = null;

    // see BIP44 for why this path was chosen
    // @link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki 
    const path = "m/44'/0'/0'/0/0";

    const seed = Bip39.mnemonicToSeedSync(mnemonic);
    const root = Bip32.fromSeed(seed);

    const child1 = root.derivePath(path);
    const address = getAddress(child1);
    
    of(1).pipe(
      delay(1000),
      tap(foo => {
        this.result = {
          mnemonic: mnemonic,
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
