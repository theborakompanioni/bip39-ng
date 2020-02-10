import { Injector, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataInfoServiceService } from '../../core/shared/data-info-service.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip39 from 'bip39';
import { filter, map, take, throttleTime, takeLast, endWith, concatMap, flatMap } from 'rxjs/operators';
import { of, from} from 'rxjs';
import { Bip32Path, NgBip32HdWalletView, NgBip32HdNodeView } from '../../wallet/core/wallet';

function buildPath(prefix: string, account: number, change: number, index: number): Bip32Path {
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

@Pipe({
    name: 'bitcoin'
})
export class BitcoinPipe implements PipeTransform {
  private readonly currencyPipe: CurrencyPipe;

  constructor (readonly injector: Injector) {
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

@Component({
  selector: 'app-main-front',
  templateUrl: './main-front.component.html',
  styleUrls: ['./main-front.component.scss']
})

export class MainFrontComponent implements OnInit {
  private static readonly SEARCH_QUERY_PARAM_NAME = 'q';
  private static readonly PASSPHRASE_QUERY_PARAM_NAME = 'p';
  private static readonly NETWORK_QUERY_PARAM_NAME = 'n';
  private static readonly NETWORK_DEFAULT_VALUE = Bitcoin.networks.bitcoin;

  // path : = m / purpose' / coin_type' / account' / change / address_index
  /*private readonly pathPrefixBip44 = `m/44'/0'/`; // addresses 1xxx
  private readonly pathPrefixBip49 = `m/49'/0'/`; // addresses 3xxx
  private readonly pathPrefixBip84 = `m/84'/0'/`; // addresses bc1xxx

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
  ];*/

  result: any;
  wallet: NgBip32HdWalletView;

  searchInputValue: string;
  passphraseInputValue: string;
  networkInputValue: Bitcoin.Network = MainFrontComponent.NETWORK_DEFAULT_VALUE;

  readonly networkInputSelectOptions = [{
    value: Bitcoin.networks.bitcoin,
    name: `mainnet`
  }, {
    value: Bitcoin.networks.testnet,
    name: `testnet`
  }];

  mnemonicInputChangedSubject: Subject<string> = new Subject<string>();
  searchInputChangedSubject: Subject<string> = new Subject<string>();

  tryCounter = 0;
  feelingLuckyCounterClicked = 0;
  loading = false;

  displayDetailedSettings = false;
  // readonly addressesDisplayedColumns = ['info', 'received', 'balance'];
  // ['path', 'address', 'wif', 'received', 'balance', 'lastCheckedTimestamp'];

  constructor(private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly dataInfoService: DataInfoServiceService) {
    this.searchInputValue = '';
    this.passphraseInputValue = '';
  }

  ngOnInit() {
    this.mnemonicInputChangedSubject.pipe(
    ).subscribe(mnemonic => {
      console.log('onChangeMnemonic');
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
      take(1)
    ).subscribe(p => {
    });

    this.activatedRoute.queryParamMap.pipe(
      take(1)
    ).subscribe(p => {
      this.passphraseInputValue = p.get(MainFrontComponent.PASSPHRASE_QUERY_PARAM_NAME);
      this.networkInputValue = this.networkInputSelectOptions
        .filter(val => val.name === p.get(MainFrontComponent.NETWORK_QUERY_PARAM_NAME))
        .map(val => val.value)[0] || MainFrontComponent.NETWORK_DEFAULT_VALUE;

      const mnemonic = p.get(MainFrontComponent.SEARCH_QUERY_PARAM_NAME);
      this.searchInputChangedSubject.next(mnemonic);
    });
  }

  onChangeSearchInput(mnemonic: string) {
    const queryParams = {};
    queryParams[MainFrontComponent.SEARCH_QUERY_PARAM_NAME] = mnemonic;
    queryParams[MainFrontComponent.PASSPHRASE_QUERY_PARAM_NAME] = this.passphraseInputValue;

    delete queryParams[MainFrontComponent.NETWORK_QUERY_PARAM_NAME];
    this.networkInputSelectOptions
        .filter(val => val.value === this.networkInputValue)
        .map(val => val.name)
        .forEach(networkName => {
          queryParams[MainFrontComponent.NETWORK_QUERY_PARAM_NAME] = networkName;
        });
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

    const now = Date.now();

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
    }, error => {
      this.loading = false;

      this.result = {
        error: error
      };

      console.error(error);
    }, () => {
      console.log('wallet finished');
      this.loading = false;

      if (this.wallet) {
        const sortByLastActivity = (a: NgBip32HdNodeView, b: NgBip32HdNodeView) => {
          return a.selfLatestActivity() < b.selfLatestActivity() ? 1 : -1;
        };

        const addresses = this.wallet.findAllAddresses();
        const nodesWithReceived = this.wallet.findNodesWithReceivedGreaterZero().sort(sortByLastActivity);
        const nodesWithBalance = this.wallet.findNodesWithBalanceGreaterZero().sort(sortByLastActivity);

        const mneomincIsValid = Bip39.validateMnemonic(mnemonic);
        this.result = {
          error: null,
          searchDurationInMs: Date.now() - now,

          mnemonic: this.wallet.mnemonic,
          mneomincIsValid: Bip39.validateMnemonic(mnemonic),
          mnemonicArray: !mneomincIsValid ? [] : mnemonic.split(' '),

          received: this.wallet.root.received(),
          balance: this.wallet.root.balance(),

          latestActivityTimestamp: Math.max(this.wallet.findLatestActivity() || 0, 0),
          numberOfAddressesScanned: addresses.length,
          numberOfNodes: this.wallet.findAllNodes().length,
          nodesWithReceived: nodesWithReceived,
          nodesWithBalance: nodesWithBalance,

          addresses: addresses,
          seedHex: this.wallet.seedHex(),
          wif: this.wallet.root._node.wif,
          xpriv: this.wallet.root._node.xpriv,
          xpub: this.wallet.root._node.xpub,
        };
      }

      this.result = (this.result || {});

      if (this.result.received > 0) {
        this._snackBar.open(`You found a treasure..`, '', {
          duration: 7000
        });
      }
    });
  }

}
