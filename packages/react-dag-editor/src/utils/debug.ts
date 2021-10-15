/* eslint-disable no-console */

import { isDev } from "./env";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Debug {
  public static log(message: string): void {
    if (isDev) {
      console.log(message);
    }
  }

  public static warn(message: string): void {
    if (isDev) {
      console.warn(message);
    }
  }

  public static error(...args: unknown[]): void {
    // tslint:disable-next-line: no-console
    console.error(...args);
  }

  public static never(value: never, message?: string): never {
    throw new Error(message ?? `${value} is unexpected`);
  }
}
