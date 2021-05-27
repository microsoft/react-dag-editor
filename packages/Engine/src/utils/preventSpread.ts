/* eslint-disable @typescript-eslint/tslint/config,@typescript-eslint/ban-types */
import { Debug } from "./debug";

/**
 * @param obj
 */
export function preventSpread(obj: object): void {
  Object.defineProperty(obj, "__preventSpread", {
    enumerable: true,
    configurable: false,
    get(): undefined {
      /**
       * silent warning if caused by browser extension, eg. react devtool
       * if this is caused by browser extension, document.currentScript is null
       */
      if (document.currentScript) {
        Debug.error(
          `${obj.constructor.name} is a class, which should not be used in the spread syntax or argument of Object.assign`
        );
      }
      return undefined;
    }
  });
}
