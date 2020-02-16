import { Injector, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataInfoServiceService } from '../../core/shared/data-info-service.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { randomBytes } from 'crypto';

import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip39 from 'bip39';
import { filter, map, take, throttleTime, takeLast, endWith, concatMap, flatMap } from 'rxjs/operators';
import { of, from} from 'rxjs';
import { NgBip32SeedProvider, NgBip32HdWalletView, NgBip32HdNodeView } from '../../wallet/core/wallet';


function firstNonEmptyArray(arr1: any[], arr2: any[]) {
  if (arr1.length !== 0) {
    return arr1;
  }
  if (arr2.length !== 0) {
    return arr2;
  }
  throw new Error('One of both values must not be empty');
}

function isArraysWithSameUniqueContent(arr1: any[], arr2: any[]) {
  return new Set([...arr1, ...arr2]).size === arr1.length;
}

type InputType = 'mnemonic' | 'entropy' | 'seed';
type TransformFunctionName = 'none' | 'ripemd160' | 'sha1' | 'sha256' | 'hash160' | 'hash256';

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
  (hashFunction) => (arg0) => hashFunction(Buffer.from(arg0)).toString('hex');

@Component({
  selector: 'app-main-front',
  templateUrl: './main-front.component.html',
  styleUrls: ['./main-front.component.scss']
})
export class MainFrontComponent implements OnInit {
  private static readonly SEARCH_QUERY_PARAM_NAME = 'q';
  private static readonly PASSPHRASE_QUERY_PARAM_NAME = 'p';
  private static readonly PASSPHRASE_DEFAULT_VALUE = '';
  private static readonly NETWORK_QUERY_PARAM_NAME = 'n';
  private static readonly NETWORK_DEFAULT_VALUE = Bitcoin.networks.bitcoin;
  private static readonly HASH_METHOD_QUERY_PARAM_NAME = 'h';
  private static readonly HASH_METHOD_DEFAULT_VALUE: TransformFunctionName = `none`;
  private static readonly INPUT_TYPE_QUERY_PARAM_NAME = 'i';
  private static readonly INPUT_TYPE_DEFAULT_VALUE: InputType = `mnemonic`;
  private static readonly SCAN_DEPTH_QUERY_PARAM_NAME = 'd';
  private static readonly SCAN_DEPTH_MIN_VALUE = 1;
  private static readonly SCAN_DEPTH_MAX_VALUE = 5;
  private static readonly SCAN_DEPTH_DEFAULT_VALUE = MainFrontComponent.SCAN_DEPTH_MIN_VALUE;
  private static readonly PATH_PREFIX_LIST_QUERY_PARAM_NAME = 'l';
  private static readonly PATH_PREFIX_LIST_DEFAULT_VALUE = [
    // see https://github.com/dan-da/hd-wallet-derive/blob/master/doc/wallet-bip32-path-presets.md
    `m/44'/0'/0'/0`,
    `m/49'/0'/0'/0`,
    `m/84'/0'/0'/0`,
    `m/0'/0`,
    `m/0`
  ];

  result: any;
  wallet: NgBip32HdWalletView;

  searchInputValue: string;
  passphraseInputValue: string = MainFrontComponent.PASSPHRASE_DEFAULT_VALUE;
  networkInputValue: Bitcoin.Network = MainFrontComponent.NETWORK_DEFAULT_VALUE;
  hashAlgorithmInputValue: TransformFunctionName = MainFrontComponent.HASH_METHOD_DEFAULT_VALUE;

  inputTypeInputValue: InputType = MainFrontComponent.INPUT_TYPE_DEFAULT_VALUE;
  scanDepthInputValue = MainFrontComponent.SCAN_DEPTH_DEFAULT_VALUE;
  pathPrefixListInputValue = MainFrontComponent.PATH_PREFIX_LIST_DEFAULT_VALUE.join(`,\n`);

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
    value: `none`,
    name: `none`
  }, {
    value: `ripemd160`,
    name: `ripemd160`
  }, {
    value: `sha1`,
    name: `sha1`
  }, {
    value: `sha256`,
    name: `sha256`
  }, {
    value: `hash160`,
    name: `hash160`
  }, {
    value: `hash256`,
    name: `hash256`
  }];

  readonly hashInputToFunction = {
    'none': HASH_NOP,
    'ripemd160': STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.ripemd160),
    'sha1': STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.sha1),
    'sha256': STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.sha256),
    'hash160': STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.hash160),
    'hash256': STRING_IN_STRING_OUT_HASH_FN(Bitcoin.crypto.hash256)
  };

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
      this.passphraseInputValue = p.get(MainFrontComponent.PASSPHRASE_QUERY_PARAM_NAME);
      this.networkInputValue = this.networkInputSelectOptions
        .filter(val => val.name === p.get(MainFrontComponent.NETWORK_QUERY_PARAM_NAME))
        .map(val => val.value)[0] || MainFrontComponent.NETWORK_DEFAULT_VALUE;
      this.hashAlgorithmInputValue = this.hashInputSelectOption
        .filter(val => val.name === p.get(MainFrontComponent.HASH_METHOD_QUERY_PARAM_NAME))
        .map(val => val.value as TransformFunctionName)[0] || MainFrontComponent.HASH_METHOD_DEFAULT_VALUE;
      this.inputTypeInputValue = this.inputTypeSelectOptions
        .filter(val => val.name === p.get(MainFrontComponent.INPUT_TYPE_QUERY_PARAM_NAME))
        .map(val => val.value as InputType)[0] || MainFrontComponent.INPUT_TYPE_DEFAULT_VALUE;
      this.scanDepthInputValue = Math.max(
        MainFrontComponent.SCAN_DEPTH_MIN_VALUE, Math.min(
          Number.parseInt(p.get(MainFrontComponent.SCAN_DEPTH_QUERY_PARAM_NAME), 10) || MainFrontComponent.SCAN_DEPTH_DEFAULT_VALUE,
          MainFrontComponent.SCAN_DEPTH_MAX_VALUE
        )
      );
      this.pathPrefixListInputValue = firstNonEmptyArray(
        p.getAll(MainFrontComponent.PATH_PREFIX_LIST_QUERY_PARAM_NAME),
        MainFrontComponent.PATH_PREFIX_LIST_DEFAULT_VALUE
      ).join(`,\n`);

      const searchQuery = p.get(MainFrontComponent.SEARCH_QUERY_PARAM_NAME);
      this.searchInputChangedSubject.next(searchQuery);
    });
  }

  onChangeSearchInput(searchInput: string) {
    const queryParams = {};
    queryParams[MainFrontComponent.SEARCH_QUERY_PARAM_NAME] = searchInput;

    if (this.passphraseInputValue !== MainFrontComponent.PASSPHRASE_DEFAULT_VALUE) {
      queryParams[MainFrontComponent.PASSPHRASE_QUERY_PARAM_NAME] = this.passphraseInputValue;
    }

    if (this.scanDepthInputValue !== MainFrontComponent.SCAN_DEPTH_DEFAULT_VALUE) {
      queryParams[MainFrontComponent.SCAN_DEPTH_QUERY_PARAM_NAME] = this.scanDepthInputValue;
    }

    this.networkInputSelectOptions
      .filter(val => val.value === this.networkInputValue)
      .filter(val => val.value !==  MainFrontComponent.NETWORK_DEFAULT_VALUE)
      .map(val => val.name)
      .forEach(networkName => {
        queryParams[MainFrontComponent.NETWORK_QUERY_PARAM_NAME] = networkName;
      });

    this.hashInputSelectOption
      .filter(val => val.value === this.hashAlgorithmInputValue)
      .filter(val => val.value !==  MainFrontComponent.HASH_METHOD_DEFAULT_VALUE)
      .map(val => val.name)
      .forEach(hashFunctionName => {
        queryParams[MainFrontComponent.HASH_METHOD_QUERY_PARAM_NAME] = hashFunctionName;
      });

    this.inputTypeSelectOptions
      .filter(val => val.value === this.inputTypeInputValue)
      .filter(val => val.value !==  MainFrontComponent.INPUT_TYPE_DEFAULT_VALUE)
      .map(val => val.name)
      .forEach(inputTypeName => {
        queryParams[MainFrontComponent.INPUT_TYPE_QUERY_PARAM_NAME] = inputTypeName;
      });

    const pathPrefixArray = this.pathPrefixListInputValue.split(`,`)
      .map(val => val.trim())
      .filter(val => val.length > 0);

    if (!isArraysWithSameUniqueContent(pathPrefixArray, MainFrontComponent.PATH_PREFIX_LIST_DEFAULT_VALUE)) {
      queryParams[MainFrontComponent.PATH_PREFIX_LIST_QUERY_PARAM_NAME] = pathPrefixArray;
    }

    queryParams['ts'] = Date.now();

    // add query params but do not reload page (default if same page)
    this.router.navigate([''], {
      queryParams: queryParams,
      queryParamsHandling: null,
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

    const randomSearchInput = this.createRandomSearchInput(this.inputTypeInputValue, this.hashAlgorithmInputValue);
    this.onChangeSearchInput(randomSearchInput);
  }

  private createRandomSearchInput(inputType: InputType, transformFunctionName): string {
    if (inputType === 'entropy' && transformFunctionName === 'none') {
      return randomBytes(16).toString('hex');
    }
    if (inputType === 'seed' && transformFunctionName === 'none') {
      return randomBytes(16).toString('hex');
    }

    return Bip39.generateMnemonic();
  }

  private createSeedProviderFromInput(inputType: InputType, input: string, passphrase?: string): NgBip32SeedProvider {
    if (inputType === 'entropy') {
      return NgBip32SeedProvider.fromEntropy(input, passphrase);
    }
    if (inputType === 'mnemonic') {
      return NgBip32SeedProvider.fromMnemonic(input, passphrase);
    }
    if (inputType === 'seed') {
      return NgBip32SeedProvider.fromSeed(Buffer.from(input, 'hex'));
    }

    throw new Error(`Unknown input type: ${inputType}`);
  }

  generateResult(searchInput: string) {
    this.loading = true;
    this.result = null;
    this.wallet = null;

    const now = Date.now();

    of(1).pipe(
      map(foo => {
        const inputTransformFunction = this.hashInputToFunction[this.hashAlgorithmInputValue];
        const hashedInputOrUnchanged: string = inputTransformFunction(searchInput);

        const seedProvider = this.createSeedProviderFromInput(this.inputTypeInputValue, hashedInputOrUnchanged, this.passphraseInputValue);

        const wallet = new NgBip32HdWalletView(seedProvider, this.networkInputValue, this.dataInfoService);

        const pathPrefixList = this.pathPrefixListInputValue.split(',')
          .map(val => val.trim())
          .filter(val => val.length > 0);

        pathPrefixList.forEach(pathPrefix => {
          const pathRootNode = wallet.getOrCreateNode(pathPrefix);
          for (let i = 0; i < this.scanDepthInputValue; i++) {
            pathRootNode.getOrCreateNextIndex();
          }
        });

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
        const scannedAddresses = this.wallet.findAllAddresses().filter(address => address.lastCheckTimestamp > 0);
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
          numberOfAddressesScanned: scannedAddresses.length,
          numberOfNodes: this.wallet.findAllNodes().length,
          nodesWithReceived: nodesWithReceived,
          nodesWithBalance: nodesWithBalance,

          addresses: addresses,
          seedHex: '0x' + this.wallet.seedProvider.seedHex(),
          wif: this.wallet.root._node.wif,
          xpriv: this.wallet.root._node.xpriv,
          xpub: this.wallet.root._node.xpub,

          displayNodes: [...this.wallet.root.childNodes]
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
