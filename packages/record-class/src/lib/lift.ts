import { RecordBase } from "./record";

export function lift<
  Interface,
  Class extends Interface,
  T extends RecordBase<Interface, Class>
>(f: (value: Class) => Partial<Interface>) {
  return (instance: T) => {
    return instance.pipe(f);
  };
}
