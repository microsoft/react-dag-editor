export type Owner = number;

export interface IMapBuilder<K, V> {
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): IMapBuilder<K, V>;
  update(key: K, updater: (prev: V) => V): IMapBuilder<K, V>;
  delete(key: K): IMapBuilder<K, V>;
  finish(): IMap<K, V>;
}

export interface IMap<K, V> extends Iterable<[K, V]> {
  size: number;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): IMap<K, V>;
  update(key: K, updater: (prev: V) => V): IMap<K, V>;
  delete(key: K): IMap<K, V>;
  clone(): IMap<K, V>;
  entries(): IterableIterator<[K, V]>;
  values(): IterableIterator<V>;
  mutate(): IMapBuilder<K, V>;
  map<T>(f: (value: V) => T): IMap<K, T>;
  filter<T>(predicate: (value: V, key: K) => boolean): IMap<K, V>;
  forEach(f: (value: V, key: K) => void): void;
  find(predicate: (value: V) => boolean): V | undefined;
}
