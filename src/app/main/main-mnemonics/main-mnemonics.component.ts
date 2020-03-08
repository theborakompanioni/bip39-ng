import { Component, OnInit, Inject, AfterViewInit, Input } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { ArrayDataSource } from '@angular/cdk/collections';
import * as BigInt from 'big-integer';


const createMaxPageNumberForEntropyLength = (length: number) =>
  BigInt(parseInt(Array.from(Array(length), _ => 'f').join(''), 16)).minus(BigInt.one)

@Component({
  selector: 'app-main-mnemonics',
  templateUrl: './main-mnemonics.component.html',
  styleUrls: ['./main-mnemonics.component.scss']
})
export class MainMnemonicsComponent implements OnInit {
  private static readonly MAX_12_WORD_MNEMONIC_PAGE_NUMBER = createMaxPageNumberForEntropyLength(32);
  private static readonly MAX_24_WORD_MNEMONIC_PAGE_NUMBER = createMaxPageNumberForEntropyLength(64);

  private static readonly MAX_PAGE_NUMBER = MainMnemonicsComponent.MAX_24_WORD_MNEMONIC_PAGE_NUMBER;

  private pageNumber: BigInt.BigInteger;
  readonly maxPageNumber = MainMnemonicsComponent.MAX_PAGE_NUMBER;
  readonly minPageNumber = BigInt.zero;

  entropy: string;
  mnemonic: string;
  mnemonicArray: string[] = [];


  constructor(@Inject(APP_CONFIG) public readonly appConfig: IAppConfig,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('pageNumber')),
      map(val =>  BigInt(val, 10)),
      map(val => this.asPageNumberBetweenBoundaries(val))
    ).subscribe(val => {
      this.pageNumber = val;
      this.entropy = this.asFixedHexStringFromBigInteger(this.pageNumber);
      this.mnemonic = Bip39.entropyToMnemonic(this.entropy);
      this.mnemonicArray = this.mnemonic.split(' ');
    });
  }

  public gotoFirstPage() {
    return this.gotoPage(this.minPageNumber);
  }

  public gotoPreviousPage() {
    return this.gotoPage(this.pageNumber.prev());
  }

  public gotoNextPage() {
    return this.gotoPage(this.pageNumber.next());
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
}
