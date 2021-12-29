export interface IRecordApplicable<T, R> {
  (value: T): R;
}

export abstract class RecordBase<Interface, Class extends Interface> {
  public declare pipe: (
    ...list: ((value: Interface) => Partial<Interface>)[]
  ) => Class;
  public declare merge: (partial: Partial<Interface>) => Class;
  public declare toJSON: () => Interface;
  private declare $$initialize: (partial: Partial<Interface>) => void;

  protected abstract $$create(partial: Partial<Interface>): Class;

  protected constructor(partial: Partial<Interface>) {
    this.$$initialize(partial);
  }

  public clone(): Class {
    return this.merge({});
  }

  public apply<T>(this: Class, f: IRecordApplicable<Class, T>): T {
    return f(this);
  }
}
