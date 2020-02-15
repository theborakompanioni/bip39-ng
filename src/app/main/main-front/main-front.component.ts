import { Injector, Component, OnInit } from '@angular/core';
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
import { NgBip32SeedProvider, NgBip32HdWalletView, NgBip32HdNodeView } from '../../wallet/core/wallet';


function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
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

type HashFunction = (arg0: Buffer) => Buffer;
type StringToStringHashFunction = (arg0: string) => string;

const HASH_NOP: StringToStringHashFunction = (arg0) => arg0;
const STRING_IN_STRING_OUT_HASH_FN: (hashFunction: HashFunction) => StringToStringHashFunction =
  (hashFunction) => (arg0) => buf2hex(hashFunction(Buffer.from(arg0)));

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
  private static readonly HASH_METHOD_QUERY_PARAM_NAME = 'h';
  private static readonly HASH_METHOD_DEFAULT_VALUE = HASH_NOP;
  private static readonly INPUT_TYPE_QUERY_PARAM_NAME = 'i';
  private static readonly INPUT_TYPE_DEFAULT_VALUE = `mnemonic`;
  private static readonly SCAN_DEPTH_QUERY_PARAM_NAME = 'd';
  private static readonly SCAN_DEPTH_MIN_VALUE = 1;
  private static readonly SCAN_DEPTH_MAX_VALUE = 5;
  private static readonly SCAN_DEPTH_DEFAULT_VALUE = MainFrontComponent.SCAN_DEPTH_MIN_VALUE;

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
  hashAlgorithmInputValue = MainFrontComponent.HASH_METHOD_DEFAULT_VALUE;

  inputTypeInputValue = MainFrontComponent.INPUT_TYPE_DEFAULT_VALUE;
  scanDepthInputValue = MainFrontComponent.SCAN_DEPTH_DEFAULT_VALUE;

  readonly inputTypeSelectOptions = [{
    value: `mnemonic`,
    name: `mnemonic`
  }, {
    value: `entropy`,
    name: `entropy`
  }, {
    value: `seed`,
    name: `seed`
  }];

  readonly networkInputSelectOptions = [{
    value: Bitcoin.networks.bitcoin,
    name: `mainnet`
  }, {
    value: Bitcoin.networks.testnet,
    name: `testnet`
  }];

  readonly hashInputSelectOption = [{
    value: HASH_NOP,
    name: `none`
  }, {
    value: STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.ripemd160),
    name: `ripemd160`
  }, {
    value: STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.sha1),
    name: `sha1`
  }, {
    value: STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.sha256),
    name: `sha256`
  }, {
    value: STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.hash160),
    name: `hash160`
  }, {
    value: STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.hash256),
    name: `hash256`
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
      this.hashAlgorithmInputValue = this.hashInputSelectOption
        .filter(val => val.name === p.get(MainFrontComponent.HASH_METHOD_QUERY_PARAM_NAME))
        .map(val => val.value)[0] || MainFrontComponent.HASH_METHOD_DEFAULT_VALUE;
      this.inputTypeInputValue = this.inputTypeSelectOptions
        .filter(val => val.name === p.get(MainFrontComponent.INPUT_TYPE_QUERY_PARAM_NAME))
        .map(val => val.value)[0] || MainFrontComponent.INPUT_TYPE_DEFAULT_VALUE;
      this.scanDepthInputValue = Math.max(
        MainFrontComponent.SCAN_DEPTH_MIN_VALUE, Math.min(
          Number.parseInt(p.get(MainFrontComponent.SCAN_DEPTH_QUERY_PARAM_NAME), 10) || MainFrontComponent.SCAN_DEPTH_DEFAULT_VALUE,
          MainFrontComponent.SCAN_DEPTH_MAX_VALUE
        )
      );

      const searchQuery = p.get(MainFrontComponent.SEARCH_QUERY_PARAM_NAME);
      this.searchInputChangedSubject.next(searchQuery);
    });
  }

  onChangeSearchInput(searchInput: string) {
    const queryParams = {};
    queryParams[MainFrontComponent.SEARCH_QUERY_PARAM_NAME] = searchInput;
    queryParams[MainFrontComponent.PASSPHRASE_QUERY_PARAM_NAME] = this.passphraseInputValue;
    queryParams[MainFrontComponent.SCAN_DEPTH_QUERY_PARAM_NAME] = this.scanDepthInputValue;

    delete queryParams[MainFrontComponent.NETWORK_QUERY_PARAM_NAME];
    this.networkInputSelectOptions
      .filter(val => val.value === this.networkInputValue)
      .map(val => val.name)
      .forEach(networkName => {
        queryParams[MainFrontComponent.NETWORK_QUERY_PARAM_NAME] = networkName;
      });

    delete queryParams[MainFrontComponent.HASH_METHOD_QUERY_PARAM_NAME];
    this.hashInputSelectOption
      .filter(val => val.value === this.hashAlgorithmInputValue)
      .map(val => val.name)
      .forEach(hashFunctionName => {
        queryParams[MainFrontComponent.HASH_METHOD_QUERY_PARAM_NAME] = hashFunctionName;
      });

    delete queryParams[MainFrontComponent.INPUT_TYPE_QUERY_PARAM_NAME];
    this.inputTypeSelectOptions
      .filter(val => val.value === this.inputTypeInputValue)
      .map(val => val.name)
      .forEach(inputTypeName => {
        queryParams[MainFrontComponent.INPUT_TYPE_QUERY_PARAM_NAME] = inputTypeName;
      });

    queryParams['ts'] = Date.now();

    // add query params but do not reload page (default if same page)
    this.router.navigate([''], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });

    // trigger search input update
    this.searchInputChangedSubject.next(searchInput);
  }

  buttonSearchClicked() {
    this.onChangeSearchInput(this.searchInputValue);
  }

  buttonIamFeelingLuckyClicked() {
    this.feelingLuckyCounterClicked++;

    const mnemonic = Bip39.generateMnemonic();
    this.onChangeSearchInput(mnemonic);
  }

  generateResult(searchInput: string) {
    this.loading = true;
    this.result = null;
    this.wallet = null;

    const now = Date.now();

    of(1).pipe(
      map(foo => {
        const hashedInputOrUnchanged: string = this.hashAlgorithmInputValue(searchInput);

        let seedProvider: NgBip32SeedProvider;
        if (this.inputTypeInputValue === 'entropy') {
          seedProvider = NgBip32SeedProvider.fromEntropy(hashedInputOrUnchanged, this.passphraseInputValue);
        }
        if (this.inputTypeInputValue === 'mnemonic') {
          seedProvider = NgBip32SeedProvider.fromMnemonic(hashedInputOrUnchanged, this.passphraseInputValue);
        }
        if (this.inputTypeInputValue === 'seed') {
          seedProvider = NgBip32SeedProvider.fromSeed(Buffer.from(hashedInputOrUnchanged, 'hex'));
        }

        const wallet = new NgBip32HdWalletView(seedProvider, this.networkInputValue, this.dataInfoService);

        // private pathPrefixBip44 = `m/44'/0'/`; // addresses 1xxx
        // private pathPrefixBip49 = `m/49'/0'/`; // addresses 3xxx
        // private pathPrefixBip84 = `m/84'/0'/`; // addresses bc1xxx

        for (let i = 0; i < this.scanDepthInputValue; i++) {
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

        const mnemonic = this.wallet.seedProvider.mnemonic;
        const addresses = this.wallet.findAllAddresses();
        const nodesWithReceived = this.wallet.findNodesWithReceivedGreaterZero().sort(sortByLastActivity);
        const nodesWithBalance = this.wallet.findNodesWithBalanceGreaterZero().sort(sortByLastActivity);

        const mneomincIsValid = this.wallet.seedProvider.hasValidMnemonic();
        this.result = {
          error: null,
          searchDurationInMs: Date.now() - now,

          searchInput: searchInput,
          mnemonic: mnemonic,
          mneomincIsValid: mneomincIsValid,
          mnemonicArray: !mneomincIsValid ? [] : mnemonic.split(' '),

          received: this.wallet.root.received(),
          balance: this.wallet.root.balance(),

          latestActivityTimestamp: Math.max(this.wallet.findLatestActivity() || 0, 0),
          numberOfAddressesScanned: addresses.length,
          numberOfNodes: this.wallet.findAllNodes().length,
          nodesWithReceived: nodesWithReceived,
          nodesWithBalance: nodesWithBalance,

          addresses: addresses,
          seedHex: '0x' + this.wallet.seedProvider.seedHex(),
          wif: this.wallet.root._node.wif,
          xpriv: this.wallet.root._node.xpriv,
          xpub: this.wallet.root._node.xpub,
        };
      }

      this.result = (this.result || {});

      if (this.result.received > 0) {
        this._snackBar.open(`You found a treasure..`, '', {
          duration: 7_000
        });
      }
    });
  }

}
