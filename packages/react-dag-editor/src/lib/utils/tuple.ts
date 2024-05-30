export type $Cons<Head, Tail extends unknown[]> = [Head, ...Tail];

export type $Head<Tuple extends unknown[]> = Tuple extends [infer H, ...unknown[]] ? H : never;

export type $Tail<Tuple extends unknown[]> = Tuple extends [
  unknown,
  // prettier-ignore
  ...infer T,
]
  ? T
  : never;
