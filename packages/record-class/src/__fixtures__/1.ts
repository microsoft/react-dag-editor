import { RecordBase } from "../lib/record";
import record from "./proxy.macro";

@record
export class SomeRecord extends RecordBase<SomeRecord, SomeRecord> {
  public readonly id!: string;
  public readonly name?: string = "";

  public someMethod(): void {
    //
  }
}
