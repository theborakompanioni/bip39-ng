import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../config/app.config';
import { Router } from '@angular/router';
import { BlockchainInfoServiceService } from '../../core/shared/blockchain-info-service.service';
import { HttpClient } from '@angular/common/http';


import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip39 from 'bip39';
import * as Bip32utils from 'bip32-utils';
import { filter, tap, map, flatMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

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

    const account = this.createAccountFromMnemonic(mnemonic);
    const addresses = account.getAllAddresses();
    const address = addresses[0];

    of(1).pipe(
      delay(1000),
      tap(foo => {
        this.result = {
          mnemonic: mnemonic,
          address: address,
          addresses: addresses,
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

  createAccountFromMnemonic(mnemonic: string) {
    const seed = Bip39.mnemonicToSeedSync(mnemonic);
    const m = Bitcoin.HDNode.fromSeedBuffer(seed);
    const i = m.deriveHardened(0);
    const external = i.derive(0);
    const internal = i.derive(1);
    const account = new Bip32utils.Account([
      new Bip32utils.Chain(external.neutered()),
      new Bip32utils.Chain(internal.neutered())
    ]);

    return account;
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
