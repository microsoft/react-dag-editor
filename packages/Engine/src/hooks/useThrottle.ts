/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { IScheduledCallback, throttle } from "../utils/scheduling";

/**
 * @param callback
 * @param limit
 * @param deps
 */
export function useThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  limit: number,
  deps: any[]
): IScheduledCallback<Args> {
  /**
   * wrap the throttle in useMemo,
   * or throttle generate a new function every time components rerender,
   * which cause throttle acts like a "setTimeout"
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => throttle(callback, limit), deps);
}
