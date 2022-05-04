import { RecordBase } from "./record";

export function lift<
  Interface,
  Class extends Interface,
  T extends RecordBase<Interface, Class>
>(f: (value: Interface) => Partial<Interface>) {
  return (instance: T) => {
    return instance.pipe(f);
  };
}

export function liftMerge<Interface, Class extends Interface>(
  partial: Partial<Interface>
) {
  return <T extends RecordBase<Interface, Class>>(instance: T) => {
    return instance.merge(partial);
  };
}
