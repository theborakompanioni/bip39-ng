import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap, map, flatMap, delay, throttleTime } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BlockchainInfoServiceService } from './blockchain-info-service.service';
import { BlockstreamInfoServiceService } from './blockstream-info-service.service';

import { AddressInfo } from '../../wallet/core/wallet';

@Injectable({
  providedIn: 'root'
})
export class DataInfoServiceService {

  constructor(
    private blockchainInfo: BlockchainInfoServiceService,
    private blockstreamInfo: BlockstreamInfoServiceService) {
  }

  public fetchReceivedByAddress(address: string, options: any = {}): Observable<number> {
    return this.blockstreamInfo.fetchReceivedByAddress(address, options);
  }

  public fetchAddressBalance(address: string, options: any = {}): Observable<number> {
    return this.blockstreamInfo.fetchAddressBalance(address, options);
  }

  public fetchAddressInfo(address: string, options: any = {}): Observable<AddressInfo> {
    return this.blockstreamInfo.fetchAddressInfo(address, options);
  }
}
