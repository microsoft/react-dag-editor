/* eslint-disable max-classes-per-file */
import { MapIterator } from "../utils/mapIterator";
import { BitmapIndexedNode } from "./champ";
import { IMap, IMapBuilder } from "./common";
import { hashing } from "./hashing";
import { Uid } from "./uid";

const uid = new Uid();

export class HashMap<K, V> implements IMap<K, V> {
  public readonly id = uid.take();
  public readonly root: BitmapIndexedNode<K, V>;

  public get size(): number {
    return this.root.size;
  }

  /**
   * @param root
   * @internal
   */
  public constructor(root: BitmapIndexedNode<K, V>) {
    this.root = root;
  }

  public static empty<TK, TV>(): HashMap<TK, TV> {
    return HashMapBuilder.empty<TK, TV>().finish();
  }

  public static from<TK, TV>(iterable: Iterable<[TK, TV]>): HashMap<TK, TV> {
    return HashMapBuilder.from(iterable).finish();
  }

  public get(key: K): V | undefined {
    const h = hashing(key);
    return this.root.get(key, h, 0);
  }

  public has(key: K): boolean {
    const h = hashing(key);
    return this.root.contains(key, h, 0);
  }

  public set(key: K, value: V): HashMap<K, V> {
    return this.withRoot(this.root.insert(uid.peek(), key, value, hashing(key), 0));
  }

  public update(key: K, updater: (prev: V) => V): HashMap<K, V> {
    return this.withRoot(this.root.update(uid.peek(), key, updater, hashing(key), 0));
  }

  public delete(key: K): HashMap<K, V> {
    const h = hashing(key);
    const id = uid.peek();
    const remove = this.root.remove(id, key, h, 0);
    return remove === undefined ? this : new HashMap<K, V>(remove[0]);
  }

  public clone(): HashMap<K, V> {
    return new HashMap<K, V>(this.root);
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  public entries(): IterableIterator<[K, V]> {
    return this.root.iter();
  }

  public values(): IterableIterator<V> {
    return new MapIterator(this.entries(), ([, v]) => v);
  }

  public mutate(): HashMapBuilder<K, V> {
    return new HashMapBuilder<K, V>(this.root);
  }

  public map<T>(f: (value: V) => T): HashMap<K, T> {
    return new HashMap<K, T>(this.root.map(uid.peek(), f));
  }

  public filter(predicate: (value: V, key: K) => boolean): HashMap<K, V> {
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

  private withRoot(newRoot: BitmapIndexedNode<K, V>): HashMap<K, V> {
    return newRoot === this.root ? this : new HashMap<K, V>(newRoot);
  }
}

export class HashMapBuilder<K, V> implements IMapBuilder<K, V> {
  public root: BitmapIndexedNode<K, V>;
  private readonly id = uid.take();

  /**
   * @param root
   * @internal
   */
  public constructor(root: BitmapIndexedNode<K, V>) {
    this.root = root;
  }

  public static empty<TK, TV>(): HashMapBuilder<TK, TV> {
    const id = uid.peek();
    const root = BitmapIndexedNode.empty<TK, TV>(id);
    return new HashMapBuilder<TK, TV>(root);
  }

  public static from<TK, TV>(iterable: Iterable<[TK, TV]>): HashMapBuilder<TK, TV> {
    if (Array.isArray(iterable)) {
      return HashMapBuilder.fromArray(iterable);
    }
    const iter = iterable[Symbol.iterator]();
    const builder = HashMapBuilder.empty<TK, TV>();
    let next = iter.next();
    while (!next.done) {
      const [key, value] = next.value;
      builder.set(key, value);
      next = iter.next();
    }
    return builder;
  }

  private static fromArray<TK, TV>(list: Array<[TK, TV]>): HashMapBuilder<TK, TV> {
    const builder = HashMapBuilder.empty<TK, TV>();
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < list.length; i += 1) {
      const [key, value] = list[i];
      builder.set(key, value);
    }
    return builder;
  }

  public get(key: K): V | undefined {
    const h = hashing(key);
    return this.root.get(key, h, 0);
  }

  public has(key: K): boolean {
    const h = hashing(key);
    return this.root.contains(key, h, 0);
  }

  public set(key: K, value: V): HashMapBuilder<K, V> {
    this.root = this.root.insert(this.id, key, value, hashing(key), 0);
    return this;
  }

  public update(key: K, updater: (prev: V) => V): HashMapBuilder<K, V> {
    const h = hashing(key);
    this.root = this.root.update(this.id, key, updater, h, 0);
    return this;
  }

  public delete(key: K): HashMapBuilder<K, V> {
    const h = hashing(key);
    const remove = this.root.remove(this.id, key, h, 0);
    if (remove !== undefined) {
      this.root = remove[0];
    }
    return this;
  }

  public finish(): HashMap<K, V> {
    return new HashMap<K, V>(this.root);
  }
}
