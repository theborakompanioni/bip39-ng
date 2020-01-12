import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap, map, flatMap, delay, throttleTime } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AddressInfo } from './data-info-service.service';

interface Stats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

interface AddressResponse {
  address: string;
  chain_stats: Stats;
  mempool_stats: Stats;
}

interface UtxoStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

interface Utxo {
  address: string;
  vout: number;
  status: UtxoStatus;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class BlockstreamInfoServiceService {

  constructor(private httpClient: HttpClient) {
  }

  public address(address: string): Observable<AddressResponse> {
    const url = `https://blockstream.info/api/address/${address}`;

    return this.httpClient.get(url).pipe(
      map(val => <AddressResponse>val)
    );
    /*
    {
      "address":"bc1qdcykktttdegcsap06v7gqv06ye45ljg5h0gt53",
      "chain_stats":{
        "funded_txo_count":3,
        "funded_txo_sum":2107313,
        "spent_txo_count":2,
        "spent_txo_sum":2106254,
        "tx_count":4
      },
      "mempool_stats":{
        "funded_txo_count":0,
        "funded_txo_sum":0,
        "spent_txo_count":0,
        "spent_txo_sum":0,
        "tx_count":0
      }
    }
    */
  }
  public utxo(address: string): Observable<Array<Utxo>> {
    const url = `https://blockstream.info/api/address/${address}/utxo`;

    return this.httpClient.get(url).pipe(
      map(val => <Array<Utxo>>val)
    );
    /*
     [{
       "txid":"c1d77411f4441a8b8b0179358886ead8df14dd620a9b59cbb8b11df58f1ff55e",
       "vout":1,
       "status":{
         "confirmed":true,
         "block_height":611942,
         "block_hash":"000000000000000000089ced765a2bd66412abb00360156ac4b431905dac412a",
         "block_time":1578518718
        },
        "value":1059
      }]
     */
  }

  public fetchReceivedByAddress(address: string): Observable<number>  {
    // -> returns Observable<satoshi value>
    return this.address(address).pipe(
      map(val => val.chain_stats),
      map(val => val.funded_txo_sum)
    );
  }

  public fetchAddressBalance(address: string): Observable<number> {
    // -> returns Observable<satoshi value>
    return this.utxo(address).pipe(
      map(val => val.reduce((acc, currVal) => acc + currVal.value, 0)),
    );
  }
}
