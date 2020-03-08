import { Injector } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

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
