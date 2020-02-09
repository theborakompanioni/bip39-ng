import * as Bitcoin from 'bitcoinjs-lib';
import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { filter, tap, map, take, defaultIfEmpty, first, last, throttleTime, takeWhile, takeLast,
  reduce, endWith, concatMap, catchError, flatMap } from 'rxjs/operators';
import { Observable, concat, of, from } from 'rxjs';

type Timestamp = number;
type HexString = string;
type Mnemonic = string;
type BitcoinAddress = string;
type Satoshi = number;
export type Bip32Path = string;

type AddressGenerationStrategy = (node: Bip32.BIP32Interface, path: Bip32Path) => NgBip32HdAddress[];
type ContinueScanningPredicate = (value: NgBip32HdNodeView, index: number) => boolean;

function isValidBip32Path(value: Bip32Path | string): boolean {
  return value.match(/^(m\/)?(\d+'?\/)*\d+'?$/) !== null;
}

export interface AddressInfo {
    address: BitcoinAddress;
    n_tx: number;
    total_received: Satoshi;
    total_sent: Satoshi;
    final_balance: Satoshi;
    latest_tx_block_time: Timestamp;
}

export interface DataInfoService {
    fetchAddressInfo(address: BitcoinAddress, options?: any): Observable<AddressInfo>;
}

interface NgBip32HdAddress {
  readonly address: BitcoinAddress;
}

class NgBip32HdAddressView {
  received?: Satoshi;
  balance?: Satoshi;
  info?: AddressInfo;
  lastCheckTimestamp?: Timestamp;
  error?: Error;

  constructor(public readonly _address: NgBip32HdAddress) {

  }
}

interface NgBip32HdNode {
    readonly _self: Bip32.BIP32Interface;

    readonly path: Bip32Path;
    readonly publicKey: HexString;
    readonly privateKey: HexString;
    readonly xpriv: string;
    readonly xpub: string;
    readonly wif: string;

    readonly addresses: NgBip32HdAddress[];

    readonly childNodes: NgBip32HdNode[];
}

function _newNodeInternal(node: Bip32.BIP32Interface, path: Bip32Path): NgBip32HdNode {
  const defaultAddressGenerationFun = (n, network) => [
    p2pkhAddress(n, network),
    segwitAdddress(n, network),
    p2wpkhAddress(n, network)
  ];

  return _newNodeInternalWithAddressGenerationStrategy(node, path, (n, p) => {
    const addresses  = generateAddressArrayFn(p, defaultAddressGenerationFun)(n, n.network);

    return addresses.map(val => {
      return {
        address: val
      };
    });
  });
}

function _newNodeInternalWithAddressGenerationStrategy(node: Bip32.BIP32Interface,
   path: Bip32Path,
   addressGen: AddressGenerationStrategy): NgBip32HdNode {
  console.log('create new node with path ' + path);
  return {
    _self: node,
    path: path,
    publicKey: '0x' + buf2hex(node.publicKey),
    privateKey: '0x' + buf2hex(node.privateKey),
    xpriv: node.toBase58(),
    xpub: node.neutered().toBase58(),
    wif: node.toWIF(),
    addresses: addressGen(node, path),
    childNodes: []
  };
}

export class NgBip32HdNodeView {
  public readonly addresses: NgBip32HdAddressView[];
  public childNodes: NgBip32HdNodeView[];

  constructor(private readonly _root: Bip32.BIP32Interface, public readonly _node: NgBip32HdNode) {
    this.addresses = _node.addresses.map(it => new NgBip32HdAddressView(it));
    this.childNodes = _node.childNodes.map(it => new NgBip32HdNodeView(_root, it));
  }

  nodesLatestActivity(): number {
    const arrayOfLatestBlocktimes: number[] = this.childNodes
     .map(node => node.addresses.filter(address => address.received > 0))
     .reduce((prev, curr) => prev.concat(curr), [])
     .filter(address => address.info !== null)
     .map(address => address.info.latest_tx_block_time);

     return Math.max(...arrayOfLatestBlocktimes, 0) || 0;
  }

  selfLatestActivity(): number {
    const arrayOfLatestBlocktimes: number[] = this.addresses
      .filter(address => address.info !== null)
      .map(address => address.info.latest_tx_block_time);

    return Math.max(...arrayOfLatestBlocktimes, 0) || 0;
  }

  latestActivity() {
    return Math.max(this.nodesLatestActivity(), this.selfLatestActivity(), 0) || 0;
  }

  errors(): Error[] {
    return this.addresses.filter(it => !!it.error).map(it => it.error);
  }

  selfBalance(): Satoshi {
    return this.addresses
      .map(it => it.balance)
      .filter(val => !!val)
      .reduce((prev, curr) => prev + curr, 0);
  }

  nodesBalance(): Satoshi {
    return this.childNodes
      .map(it => it.balance())
      .reduce((prev, curr) => prev + curr, 0);
  }

  balance(): Satoshi {
    return this.selfBalance() + this.nodesBalance();
  }

  selfReceived() {
    return this.addresses
      .map(it => it.received)
      .filter(val => !!val)
      .reduce((prev, curr) => prev + curr, 0);
  }

  nodesReceived(): Satoshi {
    return this.childNodes
      .map(it => it.received())
      .reduce((prev, curr) => prev + curr, 0);
  }

  received(): Satoshi {
    return this.selfReceived() + this.nodesReceived();
  }

  public hasNodeWithPath(path: Bip32Path): boolean {
    return this.findNodeByPath(path) !== undefined;
  }

  private findNodeByPath(path: Bip32Path): NgBip32HdNodeView | undefined {
    const nodes = this.childNodes
      .filter(it => it._node.path === path);

    return nodes.length > 0 ? nodes[0] : undefined;
  }

  _getOrCreateBySubpath(subpath: Bip32Path): NgBip32HdNodeView {
    const fullpath = `${this._node.path}/${subpath}`;
    if (this.hasNodeWithPath(fullpath)) {
      return this.findNodeByPath(fullpath);
    }

    const child: Bip32.BIP32Interface = this._root.derivePath(fullpath);
    const newNode = _newNodeInternal(child, fullpath);

    this._node.childNodes.push(newNode);
    this.childNodes.push(new NgBip32HdNodeView(this._root, newNode));

    return this.findNodeByPath(fullpath);
  }

  public getOrCreateIndex(index: number): NgBip32HdNodeView {
    return this._getOrCreateBySubpath(`${index}`);
  }

  public getOrCreateIndexRange(offet: number, amount: number = 20): NgBip32HdNodeView[] {
    return Array.from(Array(amount).keys())
      .map(val => val + offet)
      .map(index => this.getOrCreateIndex(index));
  }

  public getOrCreateNextIndex(): NgBip32HdNodeView {
    if (this.childNodes.length === 0) {
      return this.getOrCreateIndex(0);
    }

    const lastChildNode = this.childNodes[this.childNodes.length - 1];
    const currentIndex = findLastIntegerInString(lastChildNode._node.path);
    return this.getOrCreateIndex(currentIndex + 1);
  }

}

export class NgBip32HdWalletView {
  public readonly root: NgBip32HdNodeView;
  private readonly seed: Buffer;

  constructor(public readonly mnemonic: Mnemonic, passphrase?,
              private readonly network: Bitcoin.Network = Bitcoin.networks.bitcoin,
              private readonly dataInfoService?: DataInfoService) {
    this.seed = Bip39.mnemonicToSeedSync(mnemonic, passphrase);

    const rootNode = Bip32.fromSeed(this.seed, this.network);
    this.root = new NgBip32HdNodeView(rootNode, _newNodeInternal(rootNode, 'm'));
  }

  seedHex(): HexString {
    return  '0x' + buf2hex(this.seed);
  }

  hasValidMnemonic(): boolean {
    return Bip39.validateMnemonic(this.mnemonic);
  }

  getOrCreateNode(path: Bip32Path): NgBip32HdNodeView {
    if (!isValidBip32Path(path)) {
      throw new Error('invalid bip32 path');
    }

    return this.root._getOrCreateBySubpath(path.substr(2, path.length));
  }

  public scanNextChildNode(node: NgBip32HdNodeView) {
    this.scanBalanceOfNode(node.getOrCreateNextIndex())
      .subscribe();
  }

  public findAllAddresses(): NgBip32HdAddressView[] {
    return this.findAllNodes()
      .map(node => node.addresses)
      .reduce((prev, curr) => prev.concat(curr), []);
  }

  public findAllNodes(): NgBip32HdNodeView[] {
    return this.findNodesRecursive(this.root, (node) => true);
  }

  public findNodesWithBalanceGreaterZero(): NgBip32HdNodeView[] {
    return this.findNodesRecursive(this.root, (node) => node.selfBalance() > 0);
  }

  public findNodesWithReceivedGreaterZero(): NgBip32HdNodeView[] {
    return this.findNodesRecursive(this.root, (node) => node.selfReceived() > 0);
  }

  public findLatestActivity(): Timestamp | null {
     const arrayOfLatestBlocktimes: number[] = this.findNodesWithReceivedGreaterZero()
      .map(node => node.latestActivity());

      return Math.max(...arrayOfLatestBlocktimes, 0);
  }

  private findNodesRecursive(node: NgBip32HdNodeView, predicate: (node: NgBip32HdNodeView) => boolean): NgBip32HdNodeView[] {
    const nodesWithBalance = node.childNodes
      .map(childNode => this.findNodesRecursive(childNode, predicate))
      .reduce((prev, curr) => prev.concat(curr), []);

    return (predicate(node) ? [node] : []).concat(nodesWithBalance);
  }

  public scanBalances(): Observable<NgBip32HdNodeView>  {
    return this._scanAddressesBalancesRecursiveWithPredicate(this.dataInfoService, this.root, childNode => true);
  }

  public scanBalanceOfNode(nodeView: NgBip32HdNodeView): Observable<NgBip32HdNodeView>  {
    return this._scanAddressesBalancesRecursiveWithPredicate(this.dataInfoService, nodeView, childNode => true);
  }

  private _scanAddressesBalancesRecursive(dataInfoService: DataInfoService,
                                          nodeView: NgBip32HdNodeView): Observable<NgBip32HdNodeView> {
      return this._scanAddressesBalancesRecursiveWithPredicate(dataInfoService, nodeView, childNode => childNode.received() > 0);
  }

  private _scanAddressesBalancesRecursiveWithPredicate(dataInfoService: DataInfoService,
                                          nodeView: NgBip32HdNodeView,
                                          predicate: ContinueScanningPredicate): Observable<NgBip32HdNodeView> {

    const recursiveScanOfChildNodes = from(nodeView.childNodes).pipe(
        concatMap(childNode => this._scanAddressesBalancesRecursive(dataInfoService, childNode)),
        takeWhile(predicate),
        endWith(nodeView),
        last()
    );

    const options = {
      testnet: nodeView._node._self.network === Bitcoin.networks.testnet
    };

    const selfScan = of(nodeView).pipe(
      tap(node => console.log(`start fetching for path ${node._node.path}`)),
      concatMap(node => from(node.addresses).pipe(
        tap(addressView => console.log(`fetchAddressInfo for ${node._node.path} and address ${addressView._address.address}`)),
        concatMap(addressView => dataInfoService.fetchAddressInfo(addressView._address.address, options).pipe(
          tap(
            info => {
              addressView.received = info.total_received as Satoshi;
              addressView.balance = info.final_balance as Satoshi;
              addressView.info = info;
            }, error => addressView.error = error,
            () => addressView.lastCheckTimestamp = new Date().getTime()
          ),
          tap(received => {
            console.log(`${node._node.path} and address ${addressView._address.address} received ${received}`);
          }, error => console.log(`error while scanning ${node._node.path}: ${error}`)),
        )),
        map(addressView => node),
      )),
      last(),
      tap(node => console.log(`end fetching for path ${node._node.path} (received: ${node.received()}, balance: ${node.balance()})`)),
    );

    return concat(recursiveScanOfChildNodes, selfScan).pipe(
      last()
    );
  }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function p2pkhAddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2pkh({ pubkey: node.publicKey, network: network }).address!;
}

function segwitAdddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2sh({
    redeem: Bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: network }),
    network: network
  }).address!;
}

function p2wpkhAddress(node: any, network?: any): BitcoinAddress {
  return Bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: network }).address!;
}

function generateAddressArrayFn(path: string, defaultFn?: (node, network?) => BitcoinAddress[]): (node, network?) => BitcoinAddress[] {
  if (path.substr(0, `m/44'/`.length) === `m/44'/`) {
    return (node, network?) => [p2pkhAddress(node, network)];
  }
  if (path.substr(0, `m/49'/`.length) === `m/49'/`) {
    return (node, network?) => [segwitAdddress(node, network)];
  }

  if (path.substr(0, `m/84'/`.length) === `m/84'/`) {
    return (node, network?) => [p2wpkhAddress(node, network)];
  }

  return defaultFn ? defaultFn : (node, network?) => [p2wpkhAddress(node, network)];
}

function findLastIntegerInString(val: string): number | null {
  const match = val.match(/(\d+)(?!.*\d)/);
  if (match.length === 2) {
    return Number.parseInt(match[1], 10);
  }
  return null;
}

