import { is } from "./is";

export function mapCow<T, U>(
  list: readonly T[],
  f: (value: T, index: number) => U
): U[] {
  const values = [] as U[];
  let same = true;
  for (let i = 0; i < list.length; i += 1) {
    const value0 = list[i];
    const value = f(value0, i);
    same = same && is(value0, value);
    values.push(value);
  }
  return same ? (list as unknown as U[]) : values;
}
