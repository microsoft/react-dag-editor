/**
 * @param a
 * @param b
 */
export function arrayEquals<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) {
      return false;
    }
  }

  return true;
}
