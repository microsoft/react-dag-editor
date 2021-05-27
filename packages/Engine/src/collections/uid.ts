export class Uid {
  private id = 0;

  public take(): number {
    this.id += 1;
    return this.id;
  }

  public peek(): number {
    return this.id + 1;
  }
}
