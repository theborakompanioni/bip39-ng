import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlockchainInfoServiceService {

  constructor(private httpClient: HttpClient) {
  }

  public fetchReceivedByAddress(address: string) {
    const url_prefix = 'https://blockchain.info/q/getreceivedbyaddress/';
    const check_url = url_prefix + address;

    return this.httpClient.get(check_url);
  }

  public fetchAddressBalance(address: string) {
    const url_prefix = 'https://blockchain.info/q/addressbalance/';
    const check_url = url_prefix + address;

    return this.httpClient.get(check_url);
  }
}
