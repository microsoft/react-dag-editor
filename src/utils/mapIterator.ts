export class MapIterator<T, U> implements IterableIterator<U> {
  private readonly upstream: Iterator<T>;
  private readonly f: (value: T) => U;

  public constructor(upstream: Iterator<T>, f: (value: T) => U) {
    this.upstream = upstream;
    this.f = f;
  }

  public [Symbol.iterator](): IterableIterator<U> {
    return this;
  }

  public next(): IteratorResult<U> {
    const next = this.upstream.next();
    if (next.done) {
      return next;
    }
    return {
      done: false,
      value: this.f(next.value)
    };
  }
}
