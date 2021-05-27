/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
/**
 * Compressed Hash-Array Mapped Prefix-tree
 * This file contains a CHAMP implementation from scala's stdlib with modifications
 * CHAMP is an optimized HAMT
 * See paper https://michael.steindorfer.name/publications/oopsla15.pdf for more details.
 */

import { Owner } from "./common";
import { is } from "./utils";

export enum NodeType {
  Bitmap,
  Collision
}

interface INodeBase<K, V, Type extends NodeType = NodeType> {
  type: Type;
  size: number;
  getKey(index: number): K;
  getValue(index: number): V;
  getHash(index: number): number;
  get(key: K, hash: number, shift: number): V | undefined;
  contains(key: K, hash: number, shift: number): boolean;
  insert(owner: Owner, key: K, value: V, keyHash: number, shift: number): INode<K, V>;
  update(owner: Owner, key: K, updater: (prev: V) => V, keyHash: number, shift: number): INode<K, V>;
  remove(owner: Owner, key: K, hash: number, shift: number): [INode<K, V>, V] | undefined;
  iter(): IterableIterator<[K, V]>;
  map<T>(owner: Owner, f: (value: V, key: K) => T): INode<K, T>;
  forEach(f: (value: V, key: K) => void): void;
  find(predicate: (value: V) => boolean): V | undefined;
}

type INode<K, V> = BitmapIndexedNode<K, V> | HashCollisionNode<K, V>;

const HASH_CODE_LENGTH = 30;
const BIT_PARTITION_SIZE = 5;
const FULL_MASK = 0x3fffffff;

/**
 * @param mask
 */
export function bitPosFrom(mask: number): number {
  return 1 << mask;
}

/**
 * @param bitmap
 * @param mask
 * @param bitPos
 */
export function indexFrom(bitmap: number, mask: number, bitPos: number): number {
  return bitmap === FULL_MASK ? mask : bitCount(bitmap & (bitPos - 1));
}

/**
 * @param hash
 * @param shift
 */
export function maskFrom(hash: number, shift: number): number {
  return (hash >>> shift) & 0b11111;
}

/**
 * https://jsperf.com/hamming-weight/19
 *
 * @param x uint32
 */
export function bitCount(x: number): number {
  x |= 0;
  x -= (x >>> 1) & 0x55555555; // put count of each 2 bits into those 2 bits
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); // put count of each 4 bits into those 4 bits
  x = (x + (x >>> 4)) & 0x0f0f0f0f; // put count of each 8 bits into those 8 bits
  x += x >>> 8; // put count of each 16 bits into their lowest 8 bits
  x += x >>> 16; // put count of each 32 bits into their lowest 8 bits
  return x & 0x7f;
}
// tslint:enable:no-parameter-reassignment comment-format

export class BitmapIndexedNode<K, V> implements INodeBase<K, V, NodeType.Bitmap> {
  public readonly type = NodeType.Bitmap;
  public dataMap: number;
  public nodeMap: number;
  public size: number;
  private readonly keys: K[];
  private readonly values: V[];
  private readonly children: Array<INode<K, V>>;
  private readonly owner: Owner;
  private readonly hashes: number[];

  public get valueCount(): number {
    return this.values.length;
  }

  public get nodeCount(): number {
    return this.children.length;
  }

  public constructor(
    owner: Owner,
    dataMap: number,
    nodeMap: number,
    keys: K[],
    values: V[],
    children: Array<INode<K, V>>,
    hashes: number[],
    size: number
  ) {
    this.owner = owner;
    this.dataMap = dataMap;
    this.nodeMap = nodeMap;
    this.keys = keys;
    this.values = values;
    this.children = children;
    this.hashes = hashes;
    this.size = size;
  }

  public static empty<TK, TV>(owner: Owner): BitmapIndexedNode<TK, TV> {
    return new BitmapIndexedNode<TK, TV>(owner, 0, 0, [], [], [], [], 0);
  }

  public getKey(index: number): K {
    return this.keys[index];
  }

  public getValue(index: number): V {
    return this.values[index];
  }

  public getHash(index: number): number {
    return this.hashes[index];
  }

  public getNode(index: number): INode<K, V> {
    return this.children[index];
  }

  public contains(key: K, keyHash: number, shift: number): boolean {
    const mask = maskFrom(keyHash, shift);
    const bitPos = bitPosFrom(mask);
    const { dataMap, nodeMap } = this;
    if ((dataMap & bitPos) !== 0) {
      const index = indexFrom(dataMap, mask, bitPos);
      const key0 = this.getKey(index);
      return is(key0, key);
    } else if ((nodeMap & bitPos) !== 0) {
      const index = indexFrom(nodeMap, mask, bitPos);
      return this.getNode(index).contains(key, keyHash, shift + BIT_PARTITION_SIZE);
    }
    return false;
  }

  public get(key: K, keyHash: number, shift: number): V | undefined {
    const mask = maskFrom(keyHash, shift);
    const bitPos = bitPosFrom(mask);
    const { dataMap, nodeMap } = this;
    if ((dataMap & bitPos) !== 0) {
      const index = indexFrom(dataMap, mask, bitPos);
      const key0 = this.getKey(index);
      return is(key0, key) ? this.getValue(index) : undefined;
    } else if ((nodeMap & bitPos) !== 0) {
      const index = indexFrom(nodeMap, mask, bitPos);
      return this.getNode(index).get(key, keyHash, shift + BIT_PARTITION_SIZE);
    }
    return undefined;
  }

  public insert(owner: Owner, key: K, value: V, hash: number, shift: number): BitmapIndexedNode<K, V> {
    const mask = maskFrom(hash, shift);
    const bitPos = bitPosFrom(mask);
    const { dataMap, nodeMap } = this;
    if ((dataMap & bitPos) !== 0) {
      const index = indexFrom(dataMap, mask, bitPos);
      const key0 = this.getKey(index);
      const value0 = this.getValue(index);
      const key0Hash = this.getHash(index);
      if (key0Hash === hash && is(key0, key)) {
        return is(value0, value) ? this : this.setValue(owner, value, index);
      } else {
        const subNodeNew = mergeTwoKeyValPairs(
          owner,
          key0,
          value0,
          key0Hash,
          key,
          value,
          hash,
          shift + BIT_PARTITION_SIZE
        );
        return this.migrateInlineToNode(owner, bitPos, subNodeNew);
      }
    } else if ((nodeMap & bitPos) !== 0) {
      const index = indexFrom(nodeMap, mask, bitPos);
      const subNode = this.getNode(index);
      const subNodeNew = subNode.insert(owner, key, value, hash, shift + BIT_PARTITION_SIZE);
      return this.setNode(owner, 1, subNodeNew, bitPos);
    }
    return this.insertValue(owner, bitPos, key, hash, value);
  }

  public update(owner: Owner, key: K, updater: (prev: V) => V, hash: number, shift: number): BitmapIndexedNode<K, V> {
    const mask = maskFrom(hash, shift);
    const bitPos = bitPosFrom(mask);
    const { dataMap, nodeMap } = this;
    if ((dataMap & bitPos) !== 0) {
      const index = indexFrom(dataMap, mask, bitPos);
      const key0 = this.getKey(index);
      const key0Hash = this.getHash(index);
      if (key0Hash === hash && is(key0, key)) {
        const value0 = this.getValue(index);
        const value = updater(value0);
        return is(value0, value) ? this : this.setValue(owner, value, index);
      }
    } else if ((nodeMap & bitPos) !== 0) {
      const index = indexFrom(nodeMap, mask, bitPos);
      const subNode = this.getNode(index);
      const subNodeNew = subNode.update(owner, key, updater, hash, shift + BIT_PARTITION_SIZE);
      return subNodeNew === subNode ? this : this.setNode(owner, 0, subNodeNew, bitPos);
    }
    return this;
  }

  public remove(owner: Owner, key: K, keyHash: number, shift: number): [BitmapIndexedNode<K, V>, V] | undefined {
    const mask = maskFrom(keyHash, shift);
    const bitPos = bitPosFrom(mask);
    if ((this.dataMap & bitPos) !== 0) {
      const index = indexFrom(this.dataMap, mask, bitPos);
      const key0 = this.getKey(index);
      if (is(key0, key)) {
        return this.removeValue(owner, bitPos);
      }
      return undefined;
    } else if ((this.nodeMap & bitPos) !== 0) {
      const index = indexFrom(this.nodeMap, mask, bitPos);
      const subNode = this.getNode(index);
      const remove = subNode.remove(owner, key, keyHash, shift + BIT_PARTITION_SIZE);
      if (remove === undefined) {
        return undefined;
      }
      const [subNodeNew, removedValue] = remove;
      const subNodeNewSize = subNodeNew.size;
      if (subNodeNewSize === 1) {
        if (this.size === subNode.size) {
          return [
            new BitmapIndexedNode(
              owner,
              bitPos,
              0,
              [subNodeNew.getKey(0)],
              [subNodeNew.getValue(0)],
              [],
              [subNodeNew.getHash(0)],
              1
            ),
            removedValue
          ];
        }
        return [this.migrateNodeToInline(owner, bitPos, subNodeNew), removedValue];
      }
      return [this.setNode(owner, -1, subNodeNew, bitPos), removedValue];
    }
    return undefined;
  }

  public toOwned(owner: Owner): BitmapIndexedNode<K, V> {
    return this.owner === owner
      ? this
      : new BitmapIndexedNode<K, V>(
          owner,
          this.dataMap,
          this.nodeMap,
          this.keys.slice(),
          this.values.slice(),
          this.children.slice(),
          this.hashes.slice(),
          this.size
        );
  }

  public iter(): IterableIterator<[K, V]> {
    return new BitmapIndexedNodeIterator(this);
  }

  public map<T>(owner: Owner, f: (value: V, key: K) => T): BitmapIndexedNode<K, T> {
    const valueCount = this.valueCount;
    const keys: K[] = [];
    const values: T[] = [];
    const children: Array<INode<K, T>> = [];
    let same = true;
    for (let i = 0; i < valueCount; i += 1) {
      const key = this.getKey(i);
      const value0 = this.getValue(i);
      const value = f(value0, key);
      same = same && is(value0, value);
      keys.push(key);
      values.push(value);
    }
    for (let i = 0; i < this.children.length; i += 1) {
      const node0 = this.getNode(i) as INodeBase<K, V>;
      const node = node0.map(owner, f);
      same = same && (node as unknown) === (node0 as unknown);
      children.push(node);
    }
    return same
      ? ((this as unknown) as BitmapIndexedNode<K, T>)
      : new BitmapIndexedNode(owner, this.dataMap, this.nodeMap, keys, values, children, this.hashes, this.size);
  }

  public forEach(f: (value: V, key: K) => void): void {
    for (let i = 0; i < this.values.length; i += 1) {
      const key = this.getKey(i);
      const value = this.getValue(i);
      f(value, key);
    }
    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.getNode(i);
      child.forEach(f);
    }
  }

  public find(predicate: (value: V) => boolean): V | undefined {
    for (let i = 0; i < this.values.length; i += 1) {
      const value = this.getValue(i);
      if (predicate(value)) {
        return value;
      }
    }
    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.getNode(i);
      const found = child.find(predicate);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  private dataIndex(bitPos: number): number {
    return bitCount(this.dataMap & (bitPos - 1));
  }

  private nodeIndex(bitPos: number): number {
    return bitCount(this.nodeMap & (bitPos - 1));
  }

  private setValue(owner: Owner, value: V, index: number): BitmapIndexedNode<K, V> {
    const next = this.toOwned(owner);
    next.values[index] = value;
    return next;
  }

  private insertValue(owner: Owner, bitPos: number, key: K, originalHash: number, value: V): BitmapIndexedNode<K, V> {
    const index = this.dataIndex(bitPos);
    const next = this.toOwned(owner);
    next.size += 1;
    next.dataMap |= bitPos;
    next.keys.splice(index, 0, key);
    next.values.splice(index, 0, value);
    next.hashes.splice(index, 0, originalHash);
    return next;
  }

  private migrateInlineToNode(owner: Owner, bitPos: number, child: INode<K, V>): BitmapIndexedNode<K, V> {
    const indexOld = this.dataIndex(bitPos);
    const indexNew = this.nodeIndex(bitPos);
    const next = this.toOwned(owner);
    next.dataMap ^= bitPos;
    next.nodeMap |= bitPos;
    next.keys.splice(indexOld, 1);
    next.values.splice(indexOld, 1);
    next.children.splice(indexNew, 0, child);
    next.hashes.splice(indexOld, 1);
    next.size += 1;
    return next;
  }

  private migrateNodeToInline(owner: Owner, bitPos: number, node: INodeBase<K, V>): BitmapIndexedNode<K, V> {
    const indexOld = this.nodeIndex(bitPos);
    const indexNew = this.dataIndex(bitPos);
    const key = node.getKey(0);
    const value = node.getValue(0);
    const hash = node.getHash(0);
    const next = this.toOwned(owner);
    next.dataMap = next.dataMap | bitPos;
    next.nodeMap = next.nodeMap ^ bitPos;
    next.children.splice(indexOld, 1);
    next.keys.splice(indexNew, 0, key);
    next.values.splice(indexNew, 0, value);
    next.size -= 1;
    next.hashes.splice(indexNew, 0, hash);
    return next;
  }

  private setNode(owner: Owner, sizeDelta: number, newNode: INode<K, V>, bitPos: number): BitmapIndexedNode<K, V> {
    const index = this.nodeIndex(bitPos);
    const next = this.toOwned(owner);
    next.children[index] = newNode;
    next.size = next.size + sizeDelta;
    return next;
  }

  private removeValue(owner: Owner, bitPos: number): [BitmapIndexedNode<K, V>, V] {
    const index = this.dataIndex(bitPos);
    const value = this.getValue(index);
    const next = this.toOwned(owner);
    next.dataMap ^= bitPos;
    next.keys.splice(index, 1);
    next.values.splice(index, 1);
    next.hashes.splice(index, 1);
    next.size -= 1;
    return [next, value];
  }
}

/**
 * @param owner
 * @param key0
 * @param value0
 * @param keyHash0
 * @param key1
 * @param value1
 * @param keyHash1
 * @param shift
 */
function mergeTwoKeyValPairs<K, V>(
  owner: Owner,
  key0: K,
  value0: V,
  keyHash0: number,
  key1: K,
  value1: V,
  keyHash1: number,
  shift: number
): INode<K, V> {
  if (shift >= HASH_CODE_LENGTH) {
    return new HashCollisionNode(owner, keyHash0, [key0, key1], [value0, value1]);
  } else {
    const mask0 = maskFrom(keyHash0, shift);
    const mask1 = maskFrom(keyHash1, shift);
    if (mask0 !== mask1) {
      const dataMap = bitPosFrom(mask0) | bitPosFrom(mask1);
      if (mask0 < mask1) {
        return new BitmapIndexedNode<K, V>(
          owner,
          dataMap,
          0,
          [key0, key1],
          [value0, value1],
          [],
          [keyHash0, keyHash1],
          2
        );
      }
      return new BitmapIndexedNode<K, V>(
        owner,
        dataMap,
        0,
        [key1, key0],
        [value1, value0],
        [],
        [keyHash1, keyHash0],
        2
      );
    } else {
      const nodeMap = bitPosFrom(mask0);
      const node = mergeTwoKeyValPairs(
        owner,
        key0,
        value0,
        keyHash0,
        key1,
        value1,
        keyHash1,
        shift + BIT_PARTITION_SIZE
      );
      return new BitmapIndexedNode(owner, 0, nodeMap, [], [], [node], [], node.size);
    }
  }
}

export class HashCollisionNode<K, V> implements INodeBase<K, V, NodeType.Collision> {
  public readonly type = NodeType.Collision;
  public readonly owner: Owner;
  public hash: number;
  public keys: K[];
  public values: V[];

  public get size(): number {
    return this.keys.length;
  }

  public constructor(owner: Owner, hash: number, keys: K[], values: V[]) {
    this.owner = owner;
    this.hash = hash;
    this.keys = keys;
    this.values = values;
  }

  public toOwned(owner: Owner): HashCollisionNode<K, V> {
    return this.owner === owner
      ? this
      : new HashCollisionNode<K, V>(owner, this.hash, this.keys.slice(), this.values.slice());
  }

  public contains(key: K): boolean {
    return this.keys.includes(key);
  }

  public get(key: K): V | undefined {
    const index = this.keys.findIndex(it => is(it, key));
    return index >= 0 ? this.values[index] : undefined;
  }

  public insert(owner: Owner, key: K, value: V): INode<K, V> {
    const index = this.keys.findIndex(it => is(it, key));
    if (index >= 0) {
      const value0 = this.values[index];
      if (is(value0, value)) {
        return this;
      }
      const next = this.toOwned(owner);
      next.values[index] = value;
      return next;
    } else {
      const next = this.toOwned(owner);
      next.keys.push(key);
      next.values.push(value);
      return next;
    }
  }

  public update(owner: Owner, key: K, updater: (prev: V) => V): INode<K, V> {
    const index = this.keys.findIndex(it => is(it, key));
    if (index >= 0) {
      const value0 = this.values[index];
      const value = updater(value0);
      if (is(value0, value)) {
        return this;
      }
      const next = this.toOwned(owner);
      next.values[index] = value;
      return next;
    }
    return this;
  }

  public remove(owner: Owner, key: K): [HashCollisionNode<K, V>, V] | undefined {
    const index = this.keys.findIndex(it => is(it, key));
    if (index === -1) {
      return undefined;
    }
    const value = this.getValue(index);
    return [
      new HashCollisionNode(
        owner,
        this.hash,
        this.keys.filter((_, i) => i !== index),
        this.values.filter((_, i) => i !== index)
      ),
      value
    ];
  }

  public getKey(index: number): K {
    return this.keys[index];
  }

  public getValue(index: number): V {
    return this.values[index];
  }

  public getHash(): number {
    return this.hash;
  }

  public iter(): IterableIterator<[K, V]> {
    return new HashCollisionNodeIterator(this);
  }

  public map<T>(owner: Owner, f: (value: V, key: K) => T): HashCollisionNode<K, T> {
    const len = this.size;
    const values = [] as T[];
    let update = false;
    for (let i = 0; i < len; i += 1) {
      const key = this.getKey(i);
      const value0 = this.getValue(i);
      const value = f(value0, key);
      values.push(value);
      update = is(value0, value);
    }
    return update
      ? new HashCollisionNode<K, T>(owner, this.hash, this.keys, values)
      : ((this as unknown) as HashCollisionNode<K, T>);
  }

  public forEach(f: (value: V, key: K) => void): void {
    const len = this.size;
    for (let i = 0; i < len; i += 1) {
      const key = this.getKey(i);
      const value0 = this.getValue(i);
      f(value0, key);
    }
  }

  public find(predicate: (value: V) => boolean): V | undefined {
    return this.values.find(predicate);
  }
}

export class BitmapIndexedNodeIterator<K, V> implements IterableIterator<[K, V]> {
  private readonly valueCount: number;
  private readonly nodeCount: number;
  private readonly size: number;
  private index = 0;
  private delegate: Iterator<[K, V], undefined> | null = null;
  private done = false;
  private readonly node: BitmapIndexedNode<K, V>;

  public constructor(node: BitmapIndexedNode<K, V>) {
    this.node = node;
    this.valueCount = node.valueCount;
    this.nodeCount = node.nodeCount;
    this.size = this.valueCount + this.nodeCount;
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.clone();
  }

  public next(): IteratorResult<[K, V], undefined> {
    if (this.done) {
      return {
        done: true,
        value: undefined
      };
    }
    if (this.index < this.valueCount) {
      const key = this.node.getKey(this.index);
      const value = this.node.getValue(this.index);
      this.index += 1;
      return {
        done: false,
        value: [key, value]
      };
    }
    if (this.index < this.size) {
      if (this.delegate === null) {
        this.delegate = this.node.getNode(this.index - this.valueCount).iter();
      }
      const next = this.delegate.next();
      if (next.done) {
        this.index += 1;
        this.delegate = null;
        return this.next();
      }
      return next;
    }
    this.done = true;
    return {
      done: true,
      value: undefined
    };
  }

  public clone(): BitmapIndexedNodeIterator<K, V> {
    const iter = new BitmapIndexedNodeIterator(this.node);
    iter.index = this.index;
    iter.delegate = this.delegate;
    iter.done = this.done;
    return iter;
  }
}

export class HashCollisionNodeIterator<K, V> implements IterableIterator<[K, V]> {
  private index = 0;
  private readonly node: HashCollisionNode<K, V>;

  public constructor(node: HashCollisionNode<K, V>) {
    this.node = node;
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.clone();
  }

  public next(): IteratorResult<[K, V], undefined> {
    if (this.index >= this.node.size) {
      return {
        done: true,
        value: undefined
      };
    }
    const key = this.node.getKey(this.index);
    const value = this.node.getValue(this.index);
    this.index += 1;
    return {
      done: false,
      value: [key, value]
    };
  }

  public clone(): HashCollisionNodeIterator<K, V> {
    const iter = new HashCollisionNodeIterator(this.node);
    iter.index = this.index;
    return iter;
  }
}
