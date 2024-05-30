/**
 * ```ts
 * type A = { foo?: string }
 * $Complete<A> = { foo: string | undefined }
 * ```
 */
export type $Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};
