import { RecordBase } from "./record";

export function lift<Interface, Class extends Interface>(
  f: (value: Interface) => Partial<Interface>
) {
  return <T extends RecordBase<Interface, Class>>(instance: T) => {
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
