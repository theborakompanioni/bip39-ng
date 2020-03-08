import { Injector, Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataInfoServiceService } from '../core/shared/data-info-service.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { randomBytes } from 'crypto';

import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip39 from 'bip39';
import { filter, map, take, throttleTime, takeLast, endWith, concatMap, flatMap } from 'rxjs/operators';
import { of, from} from 'rxjs';
import { NgBip32SeedProvider, NgBip32HdWalletView, NgBip32HdNodeView } from './core/wallet';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  @Input() wallet: NgBip32HdWalletView;
  displayNodes: NgBip32HdNodeView[] = [];

  constructor() {
  }

  ngOnInit() {
    this.displayNodes = [...this.wallet.root.childNodes];
  }

}
