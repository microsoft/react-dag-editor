/* eslint-disable no-plusplus */

/**
 * keep the hash function the same as immutable.js
 *
 * @param o
 */
export function hashing(o: unknown): number {
  if (o === null) {
    return 0x42108422;
  }

  switch (typeof o) {
    case "boolean":
      // The hash values for built-in constants are a 1 value for each 5-byte
      // shift region expect for the first, which encodes the value. This
      // reduces the odds of a hash collision for these common values.
      return o ? 0x32108421 : 0x32108420;
    case "number":
      return hashNumber(o);
    case "string":
      return hashString(o);
    case "object":
    case "function":
    case "symbol":
      throw new Error(
        "Using object, function and symbol as hash map key is not supported"
      );
    case "undefined":
      return 0x32108423;
    default:
      return hashString(String(o));
  }
}

// http://jsperf.com/hashing-strings
/**
 * @param str
 */
function hashString(str: string): number {
  // This is the hash from JVM
  // The hash code for a string is computed as
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
  // where s[i] is the ith character of the string and n is the length of
  // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
  // (exclusive) by dropping high bits.
  let hashed = 0;
  for (let ii = 0; ii < str.length; ii++) {
    hashed = (hashed * 31 + str.charCodeAt(ii)) | 0;
  }
  return smi(hashed);
}

/**
 * @param n
 */
function hashNumber(n: number): number {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let hash = n | 0;
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (hash !== n) {
    hash ^= n * 0xffffffff;
  }
  while (n > 0xffffffff) {
    // eslint-disable-next-line no-param-reassign
    n /= 0xffffffff;
    hash ^= n;
  }
  return smi(hash);
}

/**
 * retain 30 bits of number
 *
 * @param value
 */
function smi(value: number): number {
  return value & 0x3fffffff;
}
