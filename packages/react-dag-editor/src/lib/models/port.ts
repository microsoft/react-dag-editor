import { Properties, ReadonlyProperties, WithPropertiesRecord } from "core";
import record from "record-class/macro";
import type { $Complete } from "../utils/complete";
import type { $Model } from "./model";
import type { GraphPortStatus } from "./status";

export enum PortKind {
  Input = "input",
  Output = "output",
}

export interface ICanvasPortInit {
  readonly id: string;
  readonly name: string;
  readonly kind: PortKind;
  readonly shape?: string;
  readonly status?: GraphPortStatus;
  readonly ariaLabel?: string;
  readonly automationId?: string;
}

export interface ICanvasPort extends ICanvasPortInit {
  /**
   * relative position to node
   */
  readonly position: readonly [number, number];
}

export interface IPortState extends $Model<ICanvasPort> {}

@record
export class PortModel
  extends WithPropertiesRecord<IPortState, PortModel>
  implements $Complete<IPortState>
{
  public readonly id!: string;
  public readonly name!: string;
  public readonly kind!: PortKind;
  public readonly shape: string | undefined = undefined;
  public readonly status: GraphPortStatus | undefined = undefined;
  public readonly ariaLabel: string | undefined = undefined;
  public readonly automationId: string | undefined = undefined;
  public readonly position!: readonly [number, number];
  public readonly properties: Properties = new Properties();

  public $$create(partial: Partial<IPortState>): PortModel {
    return new PortModel(partial);
  }

  public setProperties(properties: ReadonlyProperties): PortModel {
    return this.merge({
      properties,
    });
  }
}
