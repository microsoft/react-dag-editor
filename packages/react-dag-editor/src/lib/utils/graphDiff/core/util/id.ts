export function* genAutoIncrementId(
  start = 0
): Iterator<number, number, number> {
  let i: number = start;
  for (; ; ++i) {
    yield i;
  }
}
