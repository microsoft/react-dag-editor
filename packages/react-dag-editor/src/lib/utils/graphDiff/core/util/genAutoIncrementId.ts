export function* genAutoIncrementId(
  start = 0
): Iterator<number, number, number> {
  let id: number = start;
  for (; ; ++id) {
    yield id;
  }
}
