export abstract class Record<Interface, Class extends Interface> {
  public declare pipe: (
    list: ((value: Interface) => Partial<Interface>)[]
  ) => Class;
  public declare merge: (partial: Partial<Interface>) => Class;
  private declare $$initialize: (partial: Partial<Interface>) => void;

  protected abstract $$create(partial: Partial<Interface>): Class;

  protected constructor(partial: Partial<Interface>) {
    this.$$initialize(partial);
  }

  public clone(): Class {
    return this.merge({});
  }
}
