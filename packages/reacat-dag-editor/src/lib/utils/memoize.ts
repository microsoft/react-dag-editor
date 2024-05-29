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

export function memoize<T extends unknown[], R, D>(
  f: (...args: T) => R,
  selector?: ((...args: T) => D[]) | D[]
): (...args: T) => R {
  let prev: T | D[] | undefined;
  let value: R | undefined;
  return (...args: T): R => {
    const selectedArgs = selector
      ? Array.isArray(selector)
        ? selector
        // eslint-disable-next-line prefer-spread
        : selector.apply(undefined, args)
      : args;
    if (shallowEqual(prev, selectedArgs)) {
      return value!;
    }
    prev = selectedArgs;
    // eslint-disable-next-line prefer-spread
    value = f.apply(undefined, args);
    return value!;
  };
}
