import { RecordBase } from "../lib/record";
import record from "./proxy.macro";

@record
export class SomeRecord extends RecordBase<SomeRecord, SomeRecord> {
  public field1?: string = "";
  private readonly field2 = false;

  public override $$create(partial: Partial<SomeRecord>): SomeRecord {
    return new SomeRecord(partial);
  }
}
