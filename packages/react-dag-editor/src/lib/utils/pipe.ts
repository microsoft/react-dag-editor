import { identical } from "./identical";

export function pipe<T>(...args: Array<(value: T) => T>): (value: T) => T {
  return args.reduceRight((result, current) => (value: T) => result(current(value)), identical);
}
