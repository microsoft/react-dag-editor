export class DefaultStorage implements Storage {
  public get length(): number {
    return Object.keys(this.items || {}).length;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  public items: object;

  public constructor() {
    this.items = {};
  }
  public key = () => "DefaultLocalStorage";

  public clear(): void {
    this.items = {};
  }

  public setItem(key: string, data: string): void {
    this.items[key] = data;
  }

  public getItem(key: string): string {
    return this.items[key];
  }

  public removeItem(key: string): void {
    this.items[key] = undefined;
  }
}
