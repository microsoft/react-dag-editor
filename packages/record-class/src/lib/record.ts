export interface IRecordApplicable<T, R> {
  (value: T): R;
}

export abstract class RecordBase<Interface, Class extends Interface> {
  public declare pipe: (
    ...list: ((value: Class) => Partial<Interface>)[]
  ) => Class;
  public declare merge: (partial: Partial<Interface>) => Class;

  constructor(partial: Interface) {}

  public clone(): Class {
    return this.merge({});
  }

  public apply<T>(this: Class, f: IRecordApplicable<Class, T>): T {
    return f(this);
  }
}
