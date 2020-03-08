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

@Component({
  selector: 'app-main-mnemonics',
  templateUrl: './main-mnemonics.component.html',
  styleUrls: ['./main-mnemonics.component.scss']
})
export class MainMnemonicsComponent implements OnInit {

  private pageNumber: BigInt.BigInteger;
  private maxPageNumber = BigInt(parseInt(Array.from(Array(64), _ => 'f').join(''), 16)).minus(BigInt.one);
  private minPageNumber = BigInt.zero;
  private nextPageNumberAdd = BigInt.one;
  private previousPageNumberSub = BigInt.one;

  entropy: string;
  mnemonic: string;


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
    });
  }

  public gotoFirstPage() {
    this.gotoPage(this.minPageNumber);
  }

  public gotoPreviousPage() {
    this.gotoPage(this.pageNumber.prev());
  }

  public gotoNextPage() {
    this.gotoPage(this.pageNumber.next());
  }

  public gotoLastPage() {
    this.gotoPage(this.maxPageNumber);
  }

  public gotoRandomPage() {
    this.gotoPage(BigInt.randBetween(this.minPageNumber, this.maxPageNumber));
  }

  public gotoPage(pageNumber: BigInt.BigInteger) {
    const validPageNumber = this.asPageNumberBetweenBoundaries(pageNumber);
    this.router.navigate(['../' + validPageNumber.toString(10)], {
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
    if (length < valAsHex.length) {
      throw new Error('`val` as hex in greater than given `length`. Consider bigger `length` param');
    }
    // "000000".substr(0, 6 - hex.length)
    const zeros = Array.from(Array(length), _ => '0').join('');
    return zeros.substr(0, zeros.length - valAsHex.length) + valAsHex;
  }
}
