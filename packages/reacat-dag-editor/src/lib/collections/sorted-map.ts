/* eslint-disable max-classes-per-file */

import {
  BTreeIterator,
  emptyRoot,
  INode,
  rootInsert,
  rootRemove,
} from "./b-tree";
import { IMap, IMapBuilder } from "./common";
import { Uid } from "./uid";
import { MapIterator } from "./utils";

const uid = new Uid();

/**
 * map sorted by key
 */
export class SortedMap<K, V> implements IMap<K, V> {
  public readonly id = uid.take();
  public readonly root: INode<K, V>;
  public get size(): number {
    return this.root.size;
  }

  /**
   * @param root
   * @internal
   */
  public constructor(root: INode<K, V>) {
    this.root = root;
  }

  public static empty<Key, Value>(): SortedMap<Key, Value> {
    return SortedMapBuilder.empty<Key, Value>().finish();
  }

  public static from<Key, Value>(
    iterable: Iterable<[Key, Value]>
  ): SortedMap<Key, Value> {
    return SortedMapBuilder.from<Key, Value>(iterable).finish();
  }

  public delete(key: K): SortedMap<K, V> {
    return this.withRoot(rootRemove(uid.peek(), this.root, key));
  }

  public get(key: K): V | undefined {
    return this.root.get(key);
  }

  public has(key: K): boolean {
    return this.root.contains(key);
  }

  public set(key: K, value: V): SortedMap<K, V> {
    return this.withRoot(rootInsert(uid.peek(), this.root, key, value));
  }

  public update(key: K, updater: (prev: V) => V): SortedMap<K, V> {
    return this.withRoot(this.root.update(uid.peek(), key, updater));
  }

  public [Symbol.iterator](): Iterator<[K, V]> {
    return this.entries();
  }

  public clone(): IMap<K, V> {
    return new SortedMap(this.root);
  }

  public entries(): IterableIterator<[K, V]> {
    return new BTreeIterator(this.root);
  }

  public values(): IterableIterator<V> {
    return new MapIterator(this.entries(), ([, v]) => v);
  }

  public mutate(): SortedMapBuilder<K, V> {
    return new SortedMapBuilder(this.root);
  }

  public map<T>(f: (value: V, key: K) => T): SortedMap<K, T> {
    const root = this.root.map(uid.peek(), f);
    return new SortedMap<K, T>(root);
  }

  public filter(predicate: (value: V, key: K) => boolean): SortedMap<K, V> {
    const map = this.mutate();
    this.forEach((value, key) => {
      if (!predicate(value, key)) {
        map.delete(key);
      }
    });
    return map.finish();
  }

  public forEach(f: (value: V, key: K) => void): void {
    this.root.forEach(f);
  }

  public find(predicate: (value: V) => boolean): V | undefined {
    return this.root.find(predicate);
  }

  private withRoot(newRoot: INode<K, V>): SortedMap<K, V> {
    return newRoot === this.root ? this : new SortedMap(newRoot);
  }
}

export class SortedMapBuilder<K, V> implements IMapBuilder<K, V> {
  private readonly id = uid.take();
  private root: INode<K, V>;

  /**
   * @param root
   * @internal
   */
  public constructor(root: INode<K, V>) {
    this.root = root;
  }

  public static empty<Key, Value>(): SortedMapBuilder<Key, Value> {
    const id = uid.peek();
    const root = emptyRoot<Key, Value>(id);
    return new SortedMapBuilder<Key, Value>(root);
  }

  public static from<Key, Value>(
    iterable: Iterable<[Key, Value]>
  ): SortedMapBuilder<Key, Value> {
    if (Array.isArray(iterable)) {
      return SortedMapBuilder.fromArray(iterable);
    }
    const iter = iterable[Symbol.iterator]();
    const builder = SortedMapBuilder.empty<Key, Value>();
    let next = iter.next();
    while (!next.done) {
      const [key, value] = next.value;
      builder.set(key, value);
      next = iter.next();
    }
    return builder;
  }

  private static fromArray<Key, Value>(
    list: Array<[Key, Value]>
  ): SortedMapBuilder<Key, Value> {
    const builder = SortedMapBuilder.empty<Key, Value>();
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < list.length; i += 1) {
      const [key, value] = list[i];
      builder.set(key, value);
    }
    return builder;
  }

  public delete(key: K): SortedMapBuilder<K, V> {
    this.root = rootRemove(this.id, this.root, key);
    return this;
  }

  public get(key: K): V | undefined {
    return this.root.get(key);
  }

  public has(key: K): boolean {
    return this.root.contains(key);
  }

  public set(key: K, value: V): SortedMapBuilder<K, V> {
    this.root = rootInsert(this.id, this.root, key, value);
    return this;
  }

  public update(key: K, updater: (prev: V) => V): SortedMapBuilder<K, V> {
    this.root = this.root.update(this.id, key, updater);
    return this;
  }

  public finish(): SortedMap<K, V> {
    return new SortedMap(this.root);
  }
}
