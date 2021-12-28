import { RecordBase } from "record-class";

export class Property<T> {
  private declare readonly __phantomData: T;
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export interface IWithPropertiesRecord {
  readonly properties: ReadonlyMap<string, unknown>;
}

export class Properties extends Map<string, unknown> {
  public static from(
    source: Properties | ReadonlyMap<string, unknown> | Record<string, unknown>
  ): Properties {
    if (source instanceof Map) {
      return new Properties(source);
    }
    return new Properties(Object.entries(source));
  }

  public getProperty<T>(property: Property<T>): T | undefined {
    return this.get(property.name) as T | undefined;
  }

  public setProperty<T>(property: Property<T>, value: T): void {
    this.set(property.name, value);
  }

  public toJSON(): Partial<Record<string, unknown>> {
    return Object.fromEntries(this);
  }
}

export interface ReadonlyProperties extends ReadonlyMap<string, unknown> {
  getProperty<T>(property: Property<T>): T | undefined;
}

export abstract class WithPropertiesRecord<
  Interface extends IWithPropertiesRecord,
  Class extends Interface
> extends RecordBase<Interface, Class> {
  public abstract readonly properties: ReadonlyProperties;

  public abstract setProperties(properties: ReadonlyProperties): Class;

  public getProperty<T>(property: Property<T>): T | undefined {
    return this.properties.getProperty(property);
  }

  public setProperty<T>(property: Property<T>, value: unknown): Class {
    const properties = new Properties(this.properties);
    properties.setProperty(property, value);
    return this.setProperties(properties);
  }
}
