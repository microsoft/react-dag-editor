import { useEffect, useState } from "react";

export interface IDeferredValueConfig {
  timeout: number;
}

/**
 * @todo migrate to React.useDeferredValue after Concurrent mode release
 */
export function useDeferredValue<T>(
  value: T,
  { timeout }: IDeferredValueConfig
): T {
  const [state, setState] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(value);
    }, timeout);
    return () => {
      clearTimeout(timer);
    };
  }, [value, timeout]);
  return state;
}
