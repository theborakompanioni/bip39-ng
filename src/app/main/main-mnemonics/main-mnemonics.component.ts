import { Component, OnInit, Inject, AfterViewInit, Input } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import * as BigInt from 'big-integer';

import { filter, map, take, throttleTime, takeLast, endWith, concatMap, flatMap } from 'rxjs/operators';
import { of, from} from 'rxjs';
import { DataInfoServiceService } from '../../core/shared/data-info-service.service';

import { NgBip32SeedProvider, NgBip32HdWalletView, NgBip32HdNodeView } from '../../wallet/core/wallet';
const createMaxPageNumberForEntropyLength = (length: number) =>
  BigInt(parseInt(Array.from(Array(length), _ => 'f').join(''), 16)).minus(BigInt.one);

@Component({
  selector: 'app-main-mnemonics',
  templateUrl: './main-mnemonics.component.html',
  styleUrls: ['./main-mnemonics.component.scss']
})
export class MainMnemonicsComponent implements OnInit {
  private static readonly PATH_PREFIX_LIST_DEFAULT_VALUE = [
    // see https://github.com/dan-da/hd-wallet-derive/blob/master/doc/wallet-bip32-path-presets.md
    `m/44'/0'/0'/0`,
    `m/49'/0'/0'/0`,
    `m/84'/0'/0'/0`,
    `m/0'/0`,
    `m/0`
  ];
  private static readonly MAX_12_WORD_MNEMONIC_PAGE_NUMBER = createMaxPageNumberForEntropyLength(32);
  private static readonly MAX_24_WORD_MNEMONIC_PAGE_NUMBER = createMaxPageNumberForEntropyLength(64);

  private static readonly MAX_PAGE_NUMBER = MainMnemonicsComponent.MAX_24_WORD_MNEMONIC_PAGE_NUMBER;

  pageNumber: BigInt.BigInteger;
  readonly maxPageNumber = MainMnemonicsComponent.MAX_PAGE_NUMBER;
  readonly minPageNumber = BigInt.zero;

  loading = false;

  entropy: string;
  mnemonic: string;
  mnemonicArray: string[] = [];

  result: any;
  wallet: NgBip32HdWalletView;


  constructor(@Inject(APP_CONFIG) public readonly appConfig: IAppConfig,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataInfoService: DataInfoServiceService) {
  }

  ngOnInit() {
    this.reset();

    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('pageNumber')),
      map(val =>  BigInt(val, 10)),
      map(val => this.asPageNumberBetweenBoundaries(val))
    ).subscribe(async val => {
      this.reset();

      this.pageNumber = val;
      this.entropy = this.asFixedHexStringFromBigInteger(this.pageNumber);
      this.mnemonic = Bip39.entropyToMnemonic(this.entropy);
      this.mnemonicArray = this.mnemonic.split(' ');
    });
  }

  private reset() {
    this.result = null;
    this.wallet = null;
  }

  public gotoFirstPage() {
    return this.gotoPage(this.minPageNumber);
  }

  public gotoPreviousPage(step = 1) {
    return this.gotoPage(this.pageNumber.subtract(step));
  }

  public gotoNextPage(step = 1) {
    return this.gotoPage(this.pageNumber.add(step));
  }

  public gotoLastPage() {
    return this.gotoPage(this.maxPageNumber);
  }

  public gotoRandomPage() {
    const randomPageNumberFor12WordMnemonic = BigInt.randBetween(
      this.minPageNumber,
      MainMnemonicsComponent.MAX_12_WORD_MNEMONIC_PAGE_NUMBER
    );
    const randomPageNumberFor24WordMnemonic = BigInt.randBetween(
      MainMnemonicsComponent.MAX_12_WORD_MNEMONIC_PAGE_NUMBER,
      this.maxPageNumber
    );
    const randomBoolean = Math.random() < 0.5;
    const randomPageNumber = randomBoolean ?
      randomPageNumberFor12WordMnemonic :
      randomPageNumberFor24WordMnemonic;

    return this.gotoPage(randomPageNumber);
  }

  public gotoPage(pageNumber: BigInt.BigInteger): Promise<boolean> {
    this.reset();

    const validPageNumber = this.asPageNumberBetweenBoundaries(pageNumber);
    return this.router.navigate(['../' + validPageNumber.toString(10)], {
      relativeTo: this.route
    });
  }

  private asPageNumberBetweenBoundaries(pageNumber: BigInt.BigInteger) {
    return BigInt.max(BigInt.min(pageNumber, this.maxPageNumber), this.minPageNumber);
  }

  private asFixedHexStringFromBigInteger(val: BigInt.BigInteger) {
    const valAsHex = val.toString(16);
    const length = valAsHex.length > 32 ? 64 : 32;
    return this.asFixedHexStringFromHexString(valAsHex, length);
  }

  private asFixedHexStringFromHexString(valAsHex: string, length: number) {
    if (length < 0 || length < valAsHex.length) {
      throw new Error('`val` as hex in greater than given `length`. Consider bigger `length` param');
    }
    const zeros = Array.from(Array(length), _ => '0').join('');
    return zeros.substr(0, zeros.length - valAsHex.length) + valAsHex;
  }

  public async scan() {
    this.loading = true;
    const now = Date.now();
    this.wallet = null;
    this.result = null;

    try {
      const wallet = await this.loadWalletFromEntropy(this.entropy).toPromise();

      console.log('wallet created');
      this.wallet = wallet;
    } catch (e) {
      this.loading = false;

      this.result = {
        error: e
      };

      console.error(e);
      return;
    }

    const sortByLastActivity = (a: NgBip32HdNodeView, b: NgBip32HdNodeView) => {
      return a.selfLatestActivity() < b.selfLatestActivity() ? 1 : -1;
    };

    const mnemonic = this.wallet.seedProvider.mnemonic;
    const addresses = this.wallet.findAllAddresses();
    const scannedAddresses = this.wallet.findAllAddresses().filter(address => address.lastCheckTimestamp > 0);
    const nodesWithReceived = this.wallet.findNodesWithReceivedGreaterZero().sort(sortByLastActivity);
    const nodesWithBalance = this.wallet.findNodesWithBalanceGreaterZero().sort(sortByLastActivity);

    this.result = {
      error: null,
      searchDurationInMs: Date.now() - now,
      mnemonic: mnemonic,

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
      xpub: this.wallet.root._node.xpub
    };

    console.log('wallet finished');
    this.loading = false;
  }

  private loadWalletFromEntropy(entropyHexString: string) {
    return of(1).pipe(
      map(foo => {
        const seedProvider = NgBip32SeedProvider.fromEntropy(entropyHexString);

        const wallet = new NgBip32HdWalletView(seedProvider, Bitcoin.networks.bitcoin, this.dataInfoService);

        const pathPrefixList = MainMnemonicsComponent.PATH_PREFIX_LIST_DEFAULT_VALUE
          .map(val => val.trim())
          .filter(val => val.length > 0);

        pathPrefixList.forEach(pathPrefix => {
          const pathRootNode = wallet.getOrCreateNode(pathPrefix);
          for (let i = 0; i < 1; i++) {
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
        filter(node => node._node.path.match(/(\/0)$/) !== null),
        map(node => node._node.path.replace(/(\/0)$/, '/1')),
        map(path => wallet.getOrCreateNode(path).getOrCreateNextIndex()),
        flatMap(changeNode => wallet.scanBalanceOfNode(changeNode)),
        map(x => wallet),
        endWith(wallet),
        takeLast(1),
      ))
    );
  }
}
