import { RecordBase } from "record-class";
import record from "record-class/macro";
import { $Complete } from "../utils/complete";
import { ICanvasPort } from "./port";
import { GraphPortStatus } from "./status";

export interface IPortModel<T = unknown> extends ICanvasPort<T> {}

@record
export class PortModel<T = unknown>
  extends RecordBase<IPortModel<T>, PortModel<T>>
  implements $Complete<IPortModel<T>>
{
  public readonly id!: string;
  public readonly name!: string;
  public readonly position!: readonly [number, number];
  public readonly shape: string | undefined = undefined;
  public readonly status: GraphPortStatus | undefined = undefined;
  public readonly isInputDisabled: boolean | undefined = undefined;
  public readonly isOutputDisabled: boolean | undefined = undefined;
  public readonly ariaLabel: string | undefined = undefined;
  public readonly data: Readonly<T> | undefined = undefined;
  public readonly automationId: string | undefined = undefined;

  public static fromJSON<T>(source: ICanvasPort<T>) {
    return new PortModel(source);
  }

  public toJSON(): ICanvasPort<T> {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      shape: this.shape,
      status: this.status,
      isInputDisabled: this.isInputDisabled,
      isOutputDisabled: this.isOutputDisabled,
      ariaLabel: this.ariaLabel,
      data: this.data,
      automationId: this.automationId,
    };
  }
}
