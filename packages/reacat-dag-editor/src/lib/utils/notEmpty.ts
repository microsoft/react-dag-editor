export const notEmpty = <T>(obj: T | undefined | null): obj is T => {
  return !!obj;
};
