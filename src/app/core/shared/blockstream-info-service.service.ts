
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap, map, concatMap, endWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AddressInfo } from '../../wallet/core/wallet';

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

interface Tx {
  txid: string;
  version: number;
  locktime: number;
  vin: Array<any>;
  vout: Array<any>;
  size: number;
  fee: number;
  status: TxStatus;
}

interface TxStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

@Injectable({
  providedIn: 'root'
})
export class BlockstreamInfoServiceService {

  constructor(private readonly httpClient: HttpClient) {
  }

  private baseUrl(options: any = {}) {
    return `https://blockstream.info/${(options.testnet ? 'testnet' : '')}`;
  }

  public fetchReceivedByAddress(address: string, options: any = {}): Observable<number>  {
    // -> returns Observable<satoshi value>
    return this.address(address, options).pipe(
      map(val => val.chain_stats),
      map(val => val.funded_txo_sum)
    );
  }

  public fetchAddressBalance(address: string, options: any = {}): Observable<number> {
    // -> returns Observable<satoshi value>
    return this.utxo(address, options).pipe(
      map(val => val.reduce((acc, currVal) => acc + currVal.value, 0)),
    );
  }

  public fetchAddressInfo(address: string, options: any = {}): Observable<AddressInfo> {
    return this.address(address, options).pipe(
      map(val => {
        const totalReceived = val.chain_stats.funded_txo_sum + val.mempool_stats.funded_txo_sum;
        const totalSent = val.chain_stats.funded_txo_sum + val.mempool_stats.funded_txo_sum;
        return {
          address: address,
          n_tx: val.chain_stats.tx_count + val.mempool_stats.tx_count,
          total_received: totalReceived,
          total_sent: totalSent,
          final_balance: totalReceived - totalSent,
          latest_tx_block_time: null
        } as AddressInfo;
      }),
      concatMap(val => of(address).pipe(
        filter(x => val.total_received > 0),
        concatMap(x => this.txs(address, options)),
        filter(txs => txs.length > 0),
        map(txs => txs[0]),
        tap(latestTx => val.latest_tx_block_time = latestTx.status.block_time),
        map(x => val),
        endWith(val)
      ))
    );
  }

  public address(address: string, options: any = {}): Observable<AddressResponse> {
    const url = `${this.baseUrl(options)}/api/address/${address}`;

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

  public utxo(address: string, options: any = {}): Observable<Array<Utxo>> {
    const url = `${this.baseUrl(options)}/api/address/${address}/utxo`;

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

  public txs(address: string, options: any = {}): Observable<Array<Tx>> {
    const url = `${this.baseUrl(options)}/api/address/${address}/txs`;

    return this.httpClient.get(url).pipe(
      map(val => <Array<Tx>>val)
    );
    /* tslint:disable max-line-length
    [
      {
          "txid": "c3401471a4087a4935a252ee8734b7b6d348f9bf6448953c032b01ac2fbdb8ea",
          "version": 1,
          "locktime": 0,
          "vin": [
              {
                  "txid": "469c26ad63d302976b53dbf95bbaff8e7587a47c418e95f6fa329eb46d2df249",
                  "vout": 0,
                  "prevout": {
                      "scriptpubkey": "16a914d52e52d40c7b692ac592b526ca1f858b8a0caf1f88ac",
                      "scriptpubkey_asm": "OP_DUP OP_HASH160 OP_PUSHBYTES_20 d52e52d40c7b692ac592b526ca1f858b8a0caf1f OP_EQUALVERIFY OP_CHECKSIG",
                      "scriptpubkey_type": "p2pkh",
                      "scriptpubkey_address": "1LOVEUdhpiUvR6QnCxHHTLK54ixMeRURiB",
                      "value": 546
                  },
                  "scriptsig": "473044022043d5a1a6b54824a1674a63e329638da9e42f61354b8f2623d25789a7a62795f0022019334a75ad586b1e769eaef3c0dc086aa6b5e159c9c3565caf54d21ac260d0980121037338cdeb5494e8f3e0652c66eea08121e91df92ef822647f70df69966083716e",
                  "scriptsig_asm": "OP_PUSHBYTES_71 3044022043d5a1a6b54824a1674a63e329638da9e42f61354b8f2623d25789a7a62795f0022019334a75ad586b1e769eaef3c0dc086aa6b5e159c9c3565caf54d21ac260d09801 OP_PUSHBYTES_33 037338cdeb5494e8f3e0652c66eea08121e91df92ef822647f70df69966083716e",
                  "is_coinbase": false,
                  "sequence": 4294967295
              },
          ],
          "vout": [
              {
                  "scriptpubkey": "16a914d52e52d40c7b692ac592b526ca1f858b8a0caf1f88ac",
                  "scriptpubkey_asm": "OP_DUP OP_HASH160 OP_PUSHBYTES_20 13a1f1cd2dcdb72644d71943d113a40bb2b177f5 OP_EQUALVERIFY OP_CHECKSIG",
                  "scriptpubkey_type": "p2pkh",
                  "scriptpubkey_address": "13noqkQsBE3NaLgPxvoYThCzCsarTCosn2",
                  "value": 546
              },
              {
                  "scriptpubkey": "6a146f6d6e69000000000000001f000000027dc50b00",
                  "scriptpubkey_asm": "OP_RETURN OP_PUSHBYTES_20 6f6d6e69000000000000001f000000027dc50b00",
                  "scriptpubkey_type": "op_return",
                  "value": 0
              }
          ],
          "size": 370,
          "weight": 1480,
          "fee": 36000,
          "status": {
              "confirmed": true,
              "block_height": 281371,
              "block_hash": "00000000000000000002112c3e9507f53d2e776cebdd8dd876df0b590ac1f89c",
              "block_time": 1572344880
          }
      }
    ]
  */
  }
}
