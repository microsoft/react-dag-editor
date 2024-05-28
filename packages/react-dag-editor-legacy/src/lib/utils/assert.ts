/**
 * @param v
 */
export function isDef<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

/**
 * @param v
 * @param message
 */
export function assertDefined<T>(
  v: T | undefined | null,
  message?: string
): asserts v is T {
  if (!isDef(v)) {
    throw new Error(message ?? "must be defined");
  }
}
