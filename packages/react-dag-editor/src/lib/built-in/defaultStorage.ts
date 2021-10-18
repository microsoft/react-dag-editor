export class DefaultStorage implements Storage {
  public get length(): number {
    return this.items.size;
  }

  public items: Map<string, string>;

  public constructor() {
    this.items = new Map();
  }
  public key = () => "DefaultLocalStorage";

  public clear(): void {
    this.items = new Map();
  }

  public setItem(key: string, data: string): void {
    this.items.set(key, data);
  }

  public getItem(key: string): string | null {
    if (!this.items.has(key)) {
      return null;
    }
    return this.items.get(key) as string;
  }

  public removeItem(key: string): void {
    this.items.delete(key);
  }
}
