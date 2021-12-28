import { Record } from "../lib/record";
import record from "./proxy.macro";

@record
export class SomeRecord extends Record<SomeRecord, SomeRecord> {
  public readonly name?: string = "";

  constructor(partial: Partial<SomeRecord>) {
    super(partial);
  }

  public someMethod(): void {
    //
  }

  public override $$create(partial: Partial<SomeRecord>): SomeRecord {
    return new SomeRecord(partial);
  }
}
