export interface IProperties {
  readonly properties: ReadonlyMap<string, unknown>;
}

export class Property<T> {
  public readonly name: string;
  private readonly __phantomData!: T;

  constructor(name: string) {
    this.name = name;
  }
}

export class PropertiesMutation {
  public readonly properties: Map<string, unknown>;

  constructor(properties: Map<string, unknown>) {
    this.properties = properties;
  }

  public get<T>(property: Property<T>): T | undefined {
    return this.properties.get(property.name) as T | undefined;
  }

  public set<T>(property: Property<T>, value: T) {
    this.properties.set(property.name, value);
  }
}

export abstract class Properties<Child> {
  protected readonly properties: ReadonlyMap<string, unknown>;

  public abstract setProperties(
    properties: ReadonlyMap<string, unknown>
  ): Child;

  public getProperty<T>(property: Property<T>): T | undefined {
    return this.properties.get(property.name) as T | undefined;
  }

  public setProperty<T>(property: Property<T>, value: T): Child {
    const properties = new Map(this.properties);
    properties.set(property.name, value);
    return this.setProperties(properties);
  }

  public mutateProperties(f: (mutation: PropertiesMutation) => void) {
    const mutation = new PropertiesMutation(new Map(this.properties));
    f(mutation);
    return this.setProperties(mutation.properties);
  }

  protected constructor(properties: Map<string, unknown>) {
    this.properties = properties;
  }

  protected getPropertiesJSON(): Record<string, unknown> {
    return Object.fromEntries(this.properties);
  }
}
