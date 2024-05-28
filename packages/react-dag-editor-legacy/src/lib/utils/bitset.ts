export const has = (mask: number) => (state: number | undefined) =>
  Boolean(pick(mask)(state));

export const add =
  (mask: number | number[]) =>
  (state: number | undefined): number => {
    const t = state || 0;
    if (Array.isArray(mask)) {
      return mask.reduce((c, m) => c | m, t);
    } else {
      return t | mask;
    }
  };

export const toggle = (mask: number) => (state: number | undefined) => {
  const t = state || 0;
  return t ^ mask;
};

export const pick = (mask: number) => (state: number | undefined) => {
  const t = state || 0;
  return t & mask;
};

export const remove =
  (mask: number | number[]) => (state: number | undefined) => {
    const t = state || 0;
    if (Array.isArray(mask)) {
      return mask.reduce((c, m) => c & ~m, t);
    } else {
      return t & ~mask;
    }
  };

export const replace = (state: number) => () => state;
