import { batchedUpdates } from "./batchedUpdates";

export interface IScheduledCallback<Args extends unknown[]> {
  (...args: Args): void;
  cancel(): void;
}

type Callback = () => void;

function makeScheduledCallback<T, Args extends unknown[]>(
  callback: (...args: Args) => void,
  schedule: (callback: Callback) => T,
  cancel: (task: T) => void
): IScheduledCallback<Args> {
  let scheduled = false;
  let currentArgs: Args;
  let task: T;
  const scheduledCallback = (...args: Args) => {
    currentArgs = args;
    if (!scheduled) {
      scheduled = true;
      task = schedule(() => {
        scheduled = false;
        batchedUpdates(() => {
          callback.apply(null, currentArgs);
        });
      });
    }
  };
  scheduledCallback.cancel = () => {
    cancel(task);
  };
  return scheduledCallback;
}

export const animationFramed = <Args extends unknown[]>(
  callback: (...args: Args) => void
) =>
  makeScheduledCallback(callback, requestAnimationFrame, cancelAnimationFrame);

export const throttle = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  limit: number
) =>
  makeScheduledCallback(callback, (cb) => setTimeout(cb, limit), clearTimeout);
