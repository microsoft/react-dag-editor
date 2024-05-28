/* eslint-disable max-classes-per-file,@typescript-eslint/no-non-null-assertion */
import { Owner } from "./common";
import { is } from "./utils";

export enum NodeType {
  Internal,
  Leaf,
}

type Insert<K, V> = [INode<K, V>] | [INode<K, V>, INode<K, V>, K, V];

interface INodeBase<K, V, T extends NodeType = NodeType> {
  type: T;
  size: number;
  selfSize: number;
  keys: K[];
  values: V[];
  getKey(index: number): K;
  getValue(index: number): V;
  get(key: K): V | undefined;
  contains(key: K): boolean;
  insert(owner: Owner, key: K, value: V): Insert<K, V>;
  update(owner: Owner, key: K, updater: (prev: V) => V): INode<K, V>;
  remove(owner: Owner, key: K): INode<K, V>;
  removeMostRight(owner: Owner): [K, V, INode<K, V>];
  map<U>(owner: Owner, f: (value: V, key: K) => U): INode<K, U>;
  toOwned(owner: Owner): INode<K, V>;
  forEach(f: (value: V, key: K) => void): void;
  find(predicate: (value: V) => boolean): V | undefined;
}

export type INode<K, V> = InternalNode<K, V> | LeafNode<K, V>;

const MAX_SIZE = 31;
const MIN_SIZE = 15;
const HALF_NODE_SPLIT = 7;

/**
 * @param list
 * @param key
 */
export function binaryFind<T>(list: T[], key: T): number {
  let start = 0;
  let end = list.length;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (start + 1 === end) {
      return list[start] >= key ? start : end;
    }
    const mid = (start + end) >>> 1;
    if (list[mid] === key) {
      return mid;
    }
    if (key < list[mid]) {
      end = mid;
    } else {
      start = mid;
    }
  }
}

export class InternalNode<K, V> implements INodeBase<K, V, NodeType.Internal> {
  public readonly type = NodeType.Internal;
  public keys: K[];
  public values: V[];
  public size: number;
  public readonly children: Array<INode<K, V>>;

  public get selfSize(): number {
    return this.keys.length;
  }

  private readonly owner: Owner;

  public constructor(
    owner: Owner,
    keys: K[],
    values: V[],
    children: Array<INode<K, V>>,
    size: number
  ) {
    this.owner = owner;
    this.keys = keys;
    this.values = values;
    this.children = children;
    this.size = size;
  }

  public iter(): Iterator<[K, V]> {
    return new BTreeIterator(this);
  }

  public toOwned(owner: Owner): InternalNode<K, V> {
    return this.owner === owner
      ? this
      : new InternalNode<K, V>(
          owner,
          this.keys.slice(),
          this.values.slice(),
          this.children.slice(),
          this.size
        );
  }

  public getKey(index: number): K {
    return this.keys[index];
  }

  public getValue(index: number): V {
    return this.values[index];
  }

  public getChild(index: number): INode<K, V> {
    return this.children[index];
  }

  public get(key: K): V | undefined {
    const size = this.selfSize;
    const index = binaryFind(this.keys, key);
    if (index !== size) {
      const key0 = this.getKey(index);
      if (key0 === key) {
        return this.getValue(index);
      }
    }
    return this.getChild(index).get(key);
  }

  public contains(key: K): boolean {
    const size = this.selfSize;
    const index = binaryFind(this.keys, key);
    if (index !== size) {
      const key0 = this.getKey(index);
      if (key0 === key) {
        return true;
      }
    }
    return this.getChild(index).contains(key);
  }

  public insert(owner: Owner, key: K, value: V): Insert<K, V> {
    const size = this.selfSize;
    const index = binaryFind(this.keys, key);
    const key0 = this.getKey(index);
    const value0 = this.getValue(index);
    if (key0 === key) {
      if (is(value0, value)) {
        return [this];
      }
      const next = this.toOwned(owner);
      next.values[index] = value;
      return [next];
    } else {
      const child0 = this.getChild(index);
      const insert = child0.insert(owner, key, value);
      if (insert.length === 1) {
        const child = insert[0];
        if (child === child0) {
          return [this];
        }
        const next = this.toOwned(owner);
        next.children[index] = child;
        return [next];
      } else if (size === MAX_SIZE) {
        return this.updateWithSplit(
          owner,
          insert[0],
          insert[1],
          insert[2],
          insert[3],
          index
        );
      } else {
        const next = this.toOwned(owner);
        next.keys.splice(index, 0, insert[2]);
        next.values.splice(index, 0, insert[3]);
        next.children.splice(index, 1, insert[0], insert[1]);
        next.size += 1;
        return [next];
      }
    }
  }

  public update(
    owner: Owner,
    key: K,
    updater: (prev: V) => V
  ): InternalNode<K, V> {
    const index = binaryFind(this.keys, key);
    const key0 = this.getKey(index);
    const value0 = this.getValue(index);
    if (key0 === key) {
      const value = updater(value0);
      if (is(value0, value)) {
        return this;
      }
      const next = this.toOwned(owner);
      next.values[index] = value;
      return next;
    } else {
      const child0 = this.getChild(index);
      const child = child0.update(owner, key, updater);
      if (child === child0) {
        return this;
      }
      const next = this.toOwned(owner);
      next.children[index] = child;
      return next;
    }
  }

  public remove(owner: Owner, key: K): INode<K, V> {
    const index = binaryFind(this.keys, key);
    const size = this.selfSize;
    const child0 = this.getChild(index);
    const originalSize = child0.size;
    const key0 = this.getKey(index);
    if (key0 === key) {
      const [removedKey, value, child] = child0.removeMostRight(owner);
      const next = this.toOwned(owner);
      next.size -= 1;
      next.keys[index] = removedKey;
      next.values[index] = value;
      next.children[index] = child;
      return next.balanceChild(owner, child, removedKey, value, index);
    } else {
      const child = child0.remove(owner, key);
      if (child.size === originalSize) {
        return this;
      }
      const next = this.toOwned(owner);
      next.size -= 1;
      next.children[index] = child;
      if (child.selfSize >= MIN_SIZE) {
        return next;
      }
      if (index === size) {
        next.balanceTail(child);
        return next;
      }
      const value0 = this.getValue(index);
      return next.balanceChild(owner, child, key0, value0, index);
    }
  }

  public removeMostRight(owner: Owner): [K, V, INode<K, V>] {
    const size = this.selfSize;
    const [key, value, child] = this.getChild(size).removeMostRight(owner);
    const next = this.toOwned(owner);
    next.size -= 1;
    next.children[size] = child;
    if (child.selfSize < MIN_SIZE) {
      next.balanceTail(child);
    }
    return [key, value, next];
  }

  public map<T>(owner: Owner, f: (value: V, key: K) => T): INode<K, T> {
    const values = [] as T[];
    const children: Array<INode<K, T>> = [];
    let same = true;
    for (let i = 0; i < this.keys.length; i += 1) {
      const key = this.getKey(i);
      const value0 = this.getValue(i);
      const value = f(value0, key);
      values.push(value);
      same = same && is(value0, value);
    }
    for (let i = 0; i < this.children.length; i += 1) {
      const child0 = this.getChild(i);
      const child = child0.map(owner, f);
      children.push(child);
      same = same && (child0 as unknown) === (child as unknown);
    }
    return same
      ? (this as unknown as INode<K, T>)
      : new InternalNode(owner, this.keys, values, children, this.size);
  }

  public forEach(f: (value: V, key: K) => void): void {
    for (let i = 0; i < this.keys.length; i += 1) {
      const key = this.getKey(i);
      const value = this.getValue(i);
      f(value, key);
    }
    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.getChild(i);
      child.forEach(f);
    }
  }

  public find(predicate: (value: V) => boolean): V | undefined {
    for (let i = 0; i < this.keys.length; i += 1) {
      const value = this.getValue(i);
      if (predicate(value)) {
        return value;
      }
    }
    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.getChild(i);
      const found = child.find(predicate);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  private balanceChild(
    owner: Owner,
    child: INode<K, V>,
    key0: K,
    value0: V,
    index: number
  ): InternalNode<K, V> {
    if (index === 0) {
      this.balanceHead(child);
      return this;
    }
    const isChildInternal = child.type === NodeType.Internal;
    const left0 = this.getChild(index - 1);
    const right0 = this.getChild(index + 1);
    if (left0.selfSize > MIN_SIZE) {
      this.rotateRight(child, left0, index, isChildInternal);
    } else if (right0.selfSize > MIN_SIZE) {
      this.rotateLeft(child, right0, index, isChildInternal);
    } else {
      const left = left0.toOwned(owner);
      const right = right0.toOwned(owner);
      const key = child.getKey(HALF_NODE_SPLIT);
      const value = child.getValue(HALF_NODE_SPLIT);
      left.keys.push(this.getKey(index - 1));
      left.values.push(this.getValue(index - 1));
      left.keys.push(...child.keys.slice(0, HALF_NODE_SPLIT));
      left.values.push(...child.values.slice(0, HALF_NODE_SPLIT));
      right.keys.unshift(key0);
      right.values.unshift(value0);
      right.keys.unshift(...child.keys.slice(HALF_NODE_SPLIT + 1, MIN_SIZE));
      right.values.unshift(
        ...child.values.slice(HALF_NODE_SPLIT + 1, MIN_SIZE)
      );
      this.keys.splice(index - 1, 2, key);
      this.values.splice(index - 1, 2, value);
      this.children.splice(index - 1, 3, left, right);
      if (isChildInternal) {
        (left as InternalNode<K, V>).children.push(
          ...child.children.slice(0, HALF_NODE_SPLIT + 1)
        );
        (right as InternalNode<K, V>).children.unshift(
          ...child.children.slice(HALF_NODE_SPLIT + 1, MIN_SIZE + 1)
        );
        (left as InternalNode<K, V>).updateSize();
        (right as InternalNode<K, V>).updateSize();
      }
    }
    return this;
  }

  private rotateLeft(
    child: INode<K, V>,
    right0: INode<K, V>,
    index: number,
    isChildInternal: boolean
  ): void {
    const right = right0.toOwned(this.owner);
    const newKey = right.keys.shift()!;
    const newValue = right.values.shift()!;
    const key0 = this.getKey(index);
    const value0 = this.getValue(index);
    child.keys.push(key0);
    child.values.push(value0);
    this.keys[index] = newKey;
    this.values[index] = newValue;
    this.children[index + 1] = right;
    if (isChildInternal) {
      const grandChild = (right as InternalNode<K, V>).children.shift()!;
      (child as InternalNode<K, V>).children.push(grandChild);
      const delta = grandChild.size + 1;
      (child as InternalNode<K, V>).size += delta;
      (right as InternalNode<K, V>).size -= delta;
    }
  }

  private rotateRight(
    child: INode<K, V>,
    left0: INode<K, V>,
    index: number,
    isChildInternal: boolean
  ): void {
    const left = left0.toOwned(this.owner);
    const newKey = left.keys.pop()!;
    const newValue = left.values.pop()!;
    const key0 = this.getKey(index - 1);
    const value0 = this.getValue(index - 1);
    child.keys.unshift(key0);
    child.values.unshift(value0);
    this.keys[index - 1] = newKey;
    this.values[index - 1] = newValue;
    this.children[index - 1] = left;
    if (isChildInternal) {
      const grandChild = (left as InternalNode<K, V>).children.pop()!;
      (child as InternalNode<K, V>).children.unshift(grandChild);
      const delta = grandChild.size + 1;
      (child as InternalNode<K, V>).size += delta;
      (left as InternalNode<K, V>).size -= delta;
    }
  }

  private balanceTail(child: INode<K, V>): void {
    const index = this.selfSize;
    const left0 = this.getChild(index - 1);
    const isChildInternal = child.type === NodeType.Internal;
    if (left0.selfSize === MIN_SIZE) {
      child.keys.unshift(this.getKey(index - 1));
      child.values.unshift(this.getValue(index - 1));
      child.keys.unshift(...left0.keys);
      child.values.unshift(...left0.values);
      this.keys.splice(index - 1, 1);
      this.values.splice(index - 1, 1);
      this.children.splice(index - 1, 1);
      if (isChildInternal) {
        child.children.unshift(...(left0 as InternalNode<K, V>).children);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (child as InternalNode<K, V>).size += left0.size + 1;
      }
    } else {
      this.rotateRight(child, left0, index, isChildInternal);
    }
  }

  private balanceHead(child: INode<K, V>): void {
    const right0 = this.getChild(1);
    const isChildInternal = child.type === NodeType.Internal;
    if (right0.selfSize === MIN_SIZE) {
      child.keys.push(this.getKey(0));
      child.values.push(this.getValue(0));
      child.keys.push(...right0.keys);
      child.values.push(...right0.values);
      this.keys.splice(0, 1);
      this.values.splice(0, 1);
      this.children.splice(1, 1);
      if (isChildInternal) {
        child.children.push(...(right0 as InternalNode<K, V>).children);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (child as InternalNode<K, V>).size += right0.size + 1;
      }
    } else {
      this.rotateLeft(child, right0, 0, isChildInternal);
    }
  }

  private updateWithSplit(
    owner: Owner,
    child1: INode<K, V>,
    child2: INode<K, V>,
    key: K,
    value: V,
    index: number
  ): [INode<K, V>, INode<K, V>, K, V] {
    const next1 = this.toOwned(owner);
    next1.keys.splice(index, 0, key);
    next1.values.splice(index, 0, value);
    next1.children.splice(index, 1, child1, child2);
    const next2 = new InternalNode(
      owner,
      next1.keys.splice(16, 16),
      next1.values.splice(16, 16),
      next1.children.splice(16, 17),
      0
    );
    const nextKey = next1.keys.pop()!;
    const nextValue = next1.values.pop()!;
    next1.updateSize();
    next2.updateSize();
    return [next1, next2, nextKey, nextValue];
  }

  private updateSize(): void {
    let sum = this.selfSize;
    const len = this.children.length;
    for (let i = 0; i < len; i += 1) {
      sum += this.children[i].size;
    }
    this.size = sum;
  }
}

export class LeafNode<K, V> implements INodeBase<K, V, NodeType.Leaf> {
  public readonly type = NodeType.Leaf;
  public keys: K[];
  public values: V[];
  private readonly owner: Owner;

  public get size(): number {
    return this.keys.length;
  }

  public get selfSize(): number {
    return this.size;
  }

  public constructor(owner: Owner, keys: K[], values: V[]) {
    this.owner = owner;
    this.keys = keys;
    this.values = values;
  }

  public toOwned(owner: Owner): LeafNode<K, V> {
    return this.owner === owner
      ? this
      : new LeafNode<K, V>(owner, this.keys.slice(), this.values.slice());
  }

  public getKey(index: number): K {
    return this.keys[index];
  }

  public getValue(index: number): V {
    return this.values[index];
  }

  public get(key: K): V | undefined {
    const size = this.selfSize;
    const index = binaryFind(this.keys, key);
    if (index !== size) {
      const key0 = this.getKey(index);
      return key0 === key ? this.getValue(index) : undefined;
    }
    return undefined;
  }

  public contains(key: K): boolean {
    const size = this.selfSize;
    const index = binaryFind(this.keys, key);
    if (index !== size) {
      const key0 = this.getKey(index);
      return key0 === key;
    }
    return false;
  }

  public insert(owner: Owner, key: K, value: V): Insert<K, V> {
    const size = this.selfSize;
    const index = binaryFind(this.keys, key);
    const key0 = index === size ? undefined : this.getKey(index);
    if (key0 === key) {
      const value0 = this.getValue(index);
      if (is(value, value0)) {
        return [this];
      }
      const next = this.toOwned(owner);
      next.values[index] = value;
      return [next];
    } else {
      if (size === MAX_SIZE) {
        return this.updateWithSplit(owner, key, value, index);
      }
      const next = this.toOwned(owner);
      next.keys.splice(index, 0, key);
      next.values.splice(index, 0, value);
      return [next];
    }
  }

  public update(owner: Owner, key: K, updater: (prev: V) => V): INode<K, V> {
    const size = this.selfSize;
    const index = binaryFind(this.keys, key);
    const key0 = index === size ? undefined : this.getKey(index);
    if (key0 === key) {
      const value0 = this.getValue(index);
      const value = updater(value0);
      if (is(value, value0)) {
        return this;
      }
      const next = this.toOwned(owner);
      next.values[index] = value;
      return next;
    }
    return this;
  }

  public remove(owner: Owner, key: K): INode<K, V> {
    const index = binaryFind(this.keys, key);
    const size = this.selfSize;
    if (index === size) {
      return this;
    }
    return this.removeIndex(owner, index);
  }

  public removeMostRight(owner: Owner): [K, V, INode<K, V>] {
    const index = this.selfSize - 1;
    const key = this.getKey(index);
    const value = this.getValue(index);
    const next = this.removeIndex(owner, index);
    return [key, value, next];
  }

  public map<T>(owner: Owner, f: (value: V, key: K) => T): INode<K, T> {
    const values = [] as T[];
    let same = true;
    for (let i = 0; i < this.keys.length; i += 1) {
      const key = this.getKey(i);
      const value0 = this.getValue(i);
      const value = f(value0, key);
      values.push(value);
      same = same && is(value0, value);
    }
    return same
      ? (this as unknown as INode<K, T>)
      : new LeafNode<K, T>(owner, this.keys, values);
  }

  public forEach(f: (value: V, key: K) => void): void {
    for (let i = 0; i < this.keys.length; i += 1) {
      const key = this.getKey(i);
      const value = this.getValue(i);
      f(value, key);
    }
  }

  public find(predicate: (value: V) => boolean): V | undefined {
    return this.values.find(predicate);
  }

  private updateWithSplit(
    owner: Owner,
    key: K,
    value: V,
    index: number
  ): [INode<K, V>, INode<K, V>, K, V] {
    const next1 = this.toOwned(owner);
    next1.keys.splice(index, 0, key);
    next1.values.splice(index, 0, value);
    const next2 = new LeafNode(
      owner,
      next1.keys.splice(16, 16),
      next1.values.splice(16, 16)
    );
    const nextKey = next1.keys.pop()!;
    const nextValue = next1.values.pop()!;
    return [next1, next2, nextKey, nextValue];
  }

  private removeIndex(owner: Owner, index: number): INode<K, V> {
    const next = this.toOwned(owner);
    next.keys.splice(index, 1);
    next.values.splice(index, 1);
    return next;
  }
}

/**
 * @param owner
 */
export function emptyRoot<K, V>(owner: Owner): INode<K, V> {
  return new LeafNode(owner, [], []);
}

/**
 * @param owner
 * @param root
 * @param key
 * @param value
 */
export function rootInsert<K, V>(
  owner: Owner,
  root: INode<K, V>,
  key: K,
  value: V
): INode<K, V> {
  if (root.selfSize === 0) {
    return new LeafNode(owner, [key], [value]);
  }
  const insert = root.insert(owner, key, value);
  if (insert.length === 1) {
    return insert[0];
  }
  const [next1, next2, newKey, newValue] = insert;
  return new InternalNode(
    owner,
    [newKey],
    [newValue],
    [next1, next2],
    next1.size + next2.size + 1
  );
}

/**
 * @param owner
 * @param root
 * @param key
 */
export function rootRemove<K, V>(
  owner: Owner,
  root: INode<K, V>,
  key: K
): INode<K, V> {
  const newRoot = root.remove(owner, key);
  if (newRoot.type === NodeType.Internal && newRoot.selfSize === 0) {
    return newRoot.getChild(0);
  }
  return newRoot;
}

export class BTreeIterator<K, V> implements IterableIterator<[K, V]> {
  private delegate: BTreeIterator<K, V> | null = null;
  private index = 0;
  private done = false;
  private readonly node: INode<K, V>;

  public constructor(node: INode<K, V>) {
    this.node = node;
    this.setDelegate(this.index);
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.clone();
  }

  public next(): IteratorResult<[K, V], undefined> {
    if (this.delegate === null) {
      return this.yieldValue();
    }
    const next = this.delegate.next();
    if (!next.done) {
      return {
        done: false,
        value: next.value,
      };
    }
    const y = this.yieldValue();
    if (this.index <= this.node.selfSize) {
      this.setDelegate(this.index);
    } else {
      this.done = true;
      this.delegate = null;
    }
    return y;
  }

  public clone(): BTreeIterator<K, V> {
    const iter = new BTreeIterator<K, V>(this.node);
    iter.delegate = this.delegate;
    iter.index = this.index;
    iter.done = this.done;
    return iter;
  }

  private setDelegate(index: number): void {
    if (this.node.type !== NodeType.Internal) {
      return;
    }
    const child = this.node.getChild(index);
    this.delegate = new BTreeIterator<K, V>(child);
  }

  private yieldValue(): IteratorResult<[K, V], undefined> {
    if (!this.done && this.index < this.node.selfSize) {
      const key = this.node.getKey(this.index);
      const value = this.node.getValue(this.index);
      this.index += 1;
      return {
        done: false,
        value: [key, value],
      };
    }
    this.done = true;
    return {
      done: true,
      value: undefined,
    };
  }
}
