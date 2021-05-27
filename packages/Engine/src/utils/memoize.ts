/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { is } from "./is";

const shallowEqual = <T extends unknown[]>(a: T | undefined, b: T): boolean => {
  if (!a) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (!is(a[i], b[i])) {
      return false;
    }
  }
  return true;
};

export function memoize<T extends unknown[], R>(
  f: (...args: T) => R
): (...args: T) => R {
  let prev: T | undefined;
  let value: R | undefined;
  return (...args: T): R => {
    if (shallowEqual(prev, args)) {
      return value!;
    }
    prev = args;
    value = f.apply(undefined, args);
    return value!;
  };
}
