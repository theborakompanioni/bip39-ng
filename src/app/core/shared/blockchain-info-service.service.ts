import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap, map, flatMap, delay, throttleTime } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AddressInfo } from './data-info-service.service';

interface MultiaddrResponse {
  addresses: AddressInfo[];
  wallet: Object;
  txs: Array<Object>;
  info: Object;
}

@Injectable({
  providedIn: 'root'
})
export class BlockchainInfoServiceService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Cannot be used in the browser atm.
   * Does not "access-control-allow-origin: *" header, like the other
   * responses do.. (e.g. /q/getreceivedbyaddress)
   */
  public multiaddr(addresses: Array<string>): Observable<MultiaddrResponse> {
    const addressesParam = addresses.join('|');
    const url = `https://blockchain.info/multiaddr?active=${addressesParam}`;

    return this.httpClient.get(url).pipe(
      map(val => <MultiaddrResponse>val)
    );
    // https://blockchain.info/multiaddr?active=1NuopUNPFWF91BYH18H3HyxfrcpVrmn7s6|1LnFgnFEpxMorhVMjQsugbWCnq8wY792Wp
    /*
    {"addresses":[{
      "address":"1NuopUNPFWF91BYH18H3HyxfrcpVrmn7s6",
      "final_balance":0,
      "n_tx":0,
      "total_received":0,
      "total_sent":0
    },
    {"address":"1LnFgnFEpxMorhVMjQsugbWCnq8wY792Wp",
    "final_balance":0,
    "n_tx":0,
    "total_received":0,
    "total_sent":0
  }],"wallet":{
    "final_balance":0,
    "n_tx":0,
    "n_tx_filtered":0,
    "total_received":0,
    "total_sent":0
  },"txs":[],
  "info":{
    "nconnected":0,
    "conversion":100000000,
    "symbol_local":{
      "code":"USD","symbol":"$","name":"U.S. dollar","conversion":12263.60370900,"symbolAppearsAfter":false,"local":true},
      "symbol_btc":{"code":"BTC","symbol":"BTC","name":"Bitcoin","conversion":100000000.00000000,"symbolAppearsAfter":true,"local":false},
      "latest_block":{
        "hash":"0000000000000000000820e95f4a5211b3fdbcc2423f8583448a68c5e05b70cf",
        "height":612573,
        "time":1578869242,
        "block_index":0
      }
    },
    "recommend_include_fee":true
  }
    */
  }

  public multiaddrInfo(addresses: Array<string>): Observable<Array<AddressInfo>> {
    return this.multiaddr(addresses).pipe(
      map(val => <Array<AddressInfo>>(val.addresses))
    );
  }

  /*
  public fetchReceivedByAddress(address: string): Observable<number> {
    return this.multiaddrInfo([address]).pipe(
      map(val => val[0]),
      map(val => val.total_received)
    );
  }

  public fetchAddressBalance(address: string): Observable<number> {
    return this.multiaddrInfo([address]).pipe(
      map(val => val[0]),
      map(val => val.final_balance)
    );
  }*/

  public fetchReceivedByAddress(address: string): Observable<number> {
    const url = `https://blockchain.info/q/getreceivedbyaddress/${address}`;
    // -> returns Observable<satoshi value>
    return this.httpClient.get(url).pipe(map(val => <number>val));
  }

  public fetchAddressBalance(address: string): Observable<number> {
    const url = `https://blockchain.info/q/addressbalance/${address}`;
    // -> returns Observable<satoshi value>
    return this.httpClient.get(url).pipe(map(val => <number>val));
  }
}
