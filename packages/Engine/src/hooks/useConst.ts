import { useRef } from "react";

/**
 * useConst providers a guaranteed singleton
 * useMemo may be invalidated by React
 * https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations
 * @param init
 */
export function useConst<T>(init: () => T): T {
  const ref = useRef<T>();
  if (ref.current === undefined) {
    ref.current = init();
  }
  return ref.current;
}
