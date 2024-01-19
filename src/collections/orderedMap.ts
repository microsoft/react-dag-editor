import { is } from "../utils/is";
import { MapIterator } from "../utils/mapIterator";
import * as BTree from "./bTree";
import * as Champ from "./champ";
import { IMap, IMapBuilder } from "./common";
import { hashing } from "./hashing";
import { Uid } from "./uid";

const uid = new Uid();

/**
 * preserve insertion order
 */
export class OrderedMap<K, V> implements IMap<K, V> {
  public readonly id = uid.take();
  /**
   * @internal
   */
  public readonly hashRoot: Champ.BitmapIndexedNode<K, number>;
  /**
   * @internal
   */
  public readonly sortedRoot: BTree.INode<number, [K, V]>;
  private readonly itemId: number;

  public get size(): number {
    return this.hashRoot.size;
  }

  /**
   * @param itemId
   * @param hashRoot
   * @param sortedRoot
   * @param itemId
   * @param hashRoot
   * @param sortedRoot
   * @param itemId
   * @param hashRoot
   * @param sortedRoot
   * @internal
   */
  public constructor(
    itemId: number,
    hashRoot: Champ.BitmapIndexedNode<K, number>,
    sortedRoot: BTree.INode<number, [K, V]>
  ) {
    this.itemId = itemId;
    this.hashRoot = hashRoot;
    this.sortedRoot = sortedRoot;
  }

  public static empty<TK, TV>(): OrderedMap<TK, TV> {
    return OrderedMapBuilder.empty<TK, TV>().finish();
  }

  public static from<TK, TV>(iterable: Iterable<[TK, TV]>): OrderedMap<TK, TV> {
    return OrderedMapBuilder.from(iterable).finish();
  }

  public delete(key: K): OrderedMap<K, V> {
    const tempId = uid.peek();
    const h = hashing(key);
    const remove = this.hashRoot.remove(tempId, key, h, 0);
    if (remove === undefined) {
      return this;
    }
    const [hashRoot, valueId] = remove;
    const sortedRoot = this.sortedRoot.remove(tempId, valueId);
    return new OrderedMap<K, V>(this.itemId, hashRoot, sortedRoot);
  }

  public get(key: K): V | undefined {
    const h = hashing(key);
    const id = this.hashRoot.get(key, h, 0);
    if (id === undefined) {
      return undefined;
    }
    const got = this.sortedRoot.get(id);
    return got?.[1];
  }

  public has(key: K): boolean {
    const h = hashing(key);
    return this.hashRoot.contains(key, h, 0);
  }

  public set(key: K, value: V): OrderedMap<K, V> {
    const temp = uid.peek();
    let itemId = this.hashRoot.get(key, hashing(key), 0);
    let hashRoot = this.hashRoot;
    if (!itemId) {
      itemId = this.itemId + 1;
      hashRoot = this.hashRoot.insert(temp, key, itemId, hashing(key), 0);
    }
    const sortedRoot = BTree.rootInsert<number, [K, V]>(temp, this.sortedRoot, itemId, [key, value]);
    return this.withRoot(this.itemId + 1, hashRoot, sortedRoot);
  }

  public update(key: K, updater: (prev: V) => V): OrderedMap<K, V> {
    const itemId = this.hashRoot.get(key, hashing(key), 0);
    if (!itemId) {
      return this;
    }
    const sortedRoot = this.sortedRoot.update(uid.peek(), itemId, (prev): [K, V] => {
      const [prevKey, prevValue] = prev;
      const value = updater(prevValue);
      return is(value, prevValue) ? prev : [prevKey, value];
    });
    return this.withRoot(this.itemId, this.hashRoot, sortedRoot);
  }

  public [Symbol.iterator](): Iterator<[K, V]> {
    return this.entries();
  }

  public clone(): IMap<K, V> {
    return new OrderedMap(this.itemId, this.hashRoot, this.sortedRoot);
  }

  public entries(): IterableIterator<[K, V]> {
    return new OrderedMapIterator(new BTree.BTreeIterator<number, [K, V]>(this.sortedRoot));
  }

  public values(): IterableIterator<V> {
    return new MapIterator(this.entries(), ([, v]) => v);
  }

  public mutate(): OrderedMapBuilder<K, V> {
    return new OrderedMapBuilder(this.itemId, this.hashRoot, this.sortedRoot);
  }

  public map<T>(f: (value: V, key: K) => T): OrderedMap<K, T> {
    const id = uid.peek();
    const g = (prev: [K, V]): [K, T] => {
      const [key, value0] = prev;
      const value = f(value0, key);
      return is(value0, value) ? (prev as unknown as [K, T]) : [key, value];
    };
    const sortedRoot = this.sortedRoot.map(id, g);
    return new OrderedMap<K, T>(this.itemId, this.hashRoot, sortedRoot);
  }

  public forEach(f: (value: V, key: K) => void): void {
    this.sortedRoot.forEach(([key, value]) => {
      f(value, key);
    });
  }

  public find(predicate: (value: V) => boolean): V | undefined {
    const found = this.sortedRoot.find(([, value]) => predicate(value));
    return found ? found[1] : undefined;
  }

  public first(): V | undefined {
    const next = this.entries().next();
    if (next.done) {
      return undefined;
    }
    return next.value[1];
  }

  public filter(predicate: (value: V, key: K) => boolean): OrderedMap<K, V> {
    const map = this.mutate();
    this.forEach((value, key) => {
      if (!predicate(value, key)) {
        map.delete(key);
      }
    });
    return map.finish();
  }

  private withRoot(
    itemId: number,
    hashRoot: Champ.BitmapIndexedNode<K, number>,
    sortedRoot: BTree.INode<number, [K, V]>
  ): OrderedMap<K, V> {
    return hashRoot === this.hashRoot && sortedRoot === this.sortedRoot
      ? this
      : new OrderedMap<K, V>(itemId, hashRoot, sortedRoot);
  }
}

export class OrderedMapIterator<K, V> implements IterableIterator<[K, V]> {
  private readonly delegate: BTree.BTreeIterator<number, [K, V]>;

  /**
   * @param delegate
   * @internal
   */
  public constructor(delegate: BTree.BTreeIterator<number, [K, V]>) {
    this.delegate = delegate;
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.clone();
  }

  public next(): IteratorResult<[K, V], undefined> {
    const next = this.delegate.next();
    if (next.done) {
      return {
        done: true,
        value: undefined
      };
    }
    return {
      done: false,
      value: next.value[1]
    };
  }

  public clone(): OrderedMapIterator<K, V> {
    return new OrderedMapIterator<K, V>(this.delegate.clone());
  }
}

export class OrderedMapBuilder<K, V> implements IMapBuilder<K, V> {
  private hashRoot: Champ.BitmapIndexedNode<K, number>;
  private sortedRoot: BTree.INode<number, [K, V]>;
  private readonly id = uid.take();
  private itemId: number;

  public constructor(
    itemId: number,
    hashRoot: Champ.BitmapIndexedNode<K, number>,
    sortedRoot: BTree.INode<number, [K, V]>
  ) {
    this.itemId = itemId;
    this.hashRoot = hashRoot;
    this.sortedRoot = sortedRoot;
  }

  public static empty<TK, TV>(): OrderedMapBuilder<TK, TV> {
    const tempId = uid.peek();
    const hashRoot = Champ.BitmapIndexedNode.empty<TK, number>(tempId);
    const sortedRoot = BTree.emptyRoot<number, [TK, TV]>(tempId);
    return new OrderedMapBuilder<TK, TV>(0, hashRoot, sortedRoot);
  }

  public static from<TK, TV>(iterable: Iterable<[TK, TV]>): OrderedMapBuilder<TK, TV> {
    if (Array.isArray(iterable)) {
      return OrderedMapBuilder.fromArray(iterable);
    }
    const builder = OrderedMapBuilder.empty<TK, TV>();
    const iterator = iterable[Symbol.iterator]();
    let next = iterator.next();
    while (!next.done) {
      const [key, value] = next.value;
      builder.set(key, value);
      next = iterator.next();
    }
    return builder;
  }

  private static fromArray<TK, TV>(list: Array<[TK, TV]>): OrderedMapBuilder<TK, TV> {
    const builder = OrderedMapBuilder.empty<TK, TV>();
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < list.length; i += 1) {
      const [key, value] = list[i];
      builder.set(key, value);
    }
    return builder;
  }

  public delete(key: K): OrderedMapBuilder<K, V> {
    const h = hashing(key);
    const remove = this.hashRoot.remove(this.id, key, h, 0);
    if (remove === undefined) {
      return this;
    }
    const id = remove[1];
    this.hashRoot = remove[0];
    this.sortedRoot = BTree.rootRemove(this.id, this.sortedRoot, id);
    return this;
  }

  public get(key: K): V | undefined {
    const h = hashing(key);
    const id = this.hashRoot.get(key, h, 0);
    if (id === undefined) {
      return undefined;
    }
    return this.sortedRoot.get(id)?.[1];
  }

  public has(key: K): boolean {
    const h = hashing(key);
    return this.hashRoot.contains(key, h, 0);
  }

  public set(key: K, value: V): OrderedMapBuilder<K, V> {
    let itemId = this.hashRoot.get(key, hashing(key), 0);
    if (itemId === undefined) {
      itemId = this.itemId + 1;
      this.itemId += 1;
      this.hashRoot = this.hashRoot.insert(this.id, key, itemId, hashing(key), 0);
    }
    this.sortedRoot = BTree.rootInsert<number, [K, V]>(this.id, this.sortedRoot, itemId, [key, value]);
    return this;
  }

  public update(key: K, updater: (prev: V) => V): OrderedMapBuilder<K, V> {
    const itemId = this.hashRoot.get(key, hashing(key), 0);
    if (!itemId) {
      return this;
    }
    this.sortedRoot = this.sortedRoot.update(this.id, itemId, (prev): [K, V] => {
      const [prevKey, prevValue] = prev;
      const value = updater(prevValue);
      return is(value, prevValue) ? prev : [prevKey, value];
    });
    return this;
  }

  public finish(): OrderedMap<K, V> {
    return new OrderedMap<K, V>(this.itemId, this.hashRoot, this.sortedRoot);
  }
}
