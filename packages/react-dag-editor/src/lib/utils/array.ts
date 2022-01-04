import { is } from "./is";

export function mapCow<T, U>(
  list: readonly T[],
  f: (value: T, index: number, array: readonly T[]) => U
): U[] {
  let changed = false;
  const values = list.map((item, index, array) => {
    const next = f(item, index, array);
    if (!is(next, item)) {
      changed = true;
    }
    return next;
  });
  return changed ? values : (list as unknown as U[]);
}
