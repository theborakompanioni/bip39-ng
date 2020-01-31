import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap, map, flatMap, delay, throttleTime } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BlockchainInfoServiceService } from './blockchain-info-service.service';
import { BlockstreamInfoServiceService } from './blockstream-info-service.service';


export interface AddressInfo {
  address: string;
  n_tx: number;
  total_received: number;
  total_sent: number;
  final_balance: number;
}

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
}
