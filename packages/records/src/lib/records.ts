export interface IRecordApplicable<T, R> {
  (value: T): R;
}

const DONT_SPREAD_CLASS_INSTANCE = "DONT_SPREAD_CLASS_INSTANCE";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;
const __DEV__ = process.env.NODE_ENV !== "production";

export abstract class RecordBase<Interface, Class extends Interface> {
  public declare pipe: (
    ...list: ((value: Class) => Partial<Interface>)[]
  ) => Class;
  public declare merge: (partial: Partial<Interface>) => Class;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected constructor(partial: Interface) {
    if (__DEV__) {
      Object.defineProperty(this, DONT_SPREAD_CLASS_INSTANCE, {
        get() {
          console.warn(
            `${this.constructor.name} is a class, don't use spread syntax on its instance`
          );
        },
      });
      if (typeof this.pipe !== "function" || typeof this.merge !== "function") {
        throw new Error(
          "Missing methods 'pipe' and 'merge', did you forget to add the 'record' macro"
        );
      }
    }
  }

  public clone(): Class {
    return this.merge({});
  }

  public applied<T>(this: Class, f: IRecordApplicable<Class, T>): T {
    return f(this);
  }
}
