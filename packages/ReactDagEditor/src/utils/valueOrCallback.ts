export type ValueOrCallback<T, C> = T | ((c: C) => T);

/**
 * @param valueOrCallback
 * @param c
 */
export function resolveValueOrCallback<T, C>(
  valueOrCallback: ValueOrCallback<T, C>,
  c: C
): T {
  if (typeof valueOrCallback === "function") {
    return (valueOrCallback as (c: C) => T)(c);
  }
  return valueOrCallback;
}
