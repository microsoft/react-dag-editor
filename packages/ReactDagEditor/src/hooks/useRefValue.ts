import { MutableRefObject, useLayoutEffect, useRef } from "react";

export function useRefValue<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
