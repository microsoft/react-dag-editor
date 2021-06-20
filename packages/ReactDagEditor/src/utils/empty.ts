const emptyArrayInstance: unknown[] = [];
/**
 *
 */
export function constantEmptyArray<T>(): readonly T[] {
  return emptyArrayInstance as T[];
}
