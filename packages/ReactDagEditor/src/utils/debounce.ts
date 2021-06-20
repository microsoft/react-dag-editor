import { isDef } from "./assert";

type ArgumentsType<F extends (...args: unknown[]) => void> = F extends (
  ...args: infer args
) => void
  ? args
  : never;
export interface IDebounceOptions {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  instance?: any;
  maxWait?: number;
}
export const debounce = <
  FN extends (...args: unknown[]) => void,
  Args extends ArgumentsType<FN>
>(
  callback: FN,
  timeout: number,
  options?: IDebounceOptions
) => {
  const { instance, maxWait } = options || {};
  let timer = 0;
  let firstInvokeTime: number | undefined;

  return (...args: Args) => {
    window.clearTimeout(timer);

    if (isDef(maxWait)) {
      const now = Date.now();
      if (!isDef(firstInvokeTime)) {
        firstInvokeTime = now;
      } else {
        if (now - firstInvokeTime >= maxWait) {
          firstInvokeTime = undefined;

          invokeCallback(args);
          return;
        }
      }
    }

    timer = window.setTimeout(() => {
      invokeCallback(args);
    }, timeout);
  };

  /**
   * @param args
   */
  function invokeCallback(args: Args): void {
    callback.apply(instance, args);
  }
};
