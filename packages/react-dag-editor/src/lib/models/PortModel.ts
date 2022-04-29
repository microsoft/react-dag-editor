import record from "record-class/macro";
import {
  IWithPropertiesRecord,
  Properties,
  ReadonlyProperties,
  WithPropertiesRecord,
} from "../properties";
import { $Complete } from "../utils/complete";
import { ICanvasPort } from "./port";
import { GraphPortStatus } from "./status";

export interface IPortModel
  extends Omit<ICanvasPort, "properties">,
    IWithPropertiesRecord {}

@record
export class PortModel
  extends WithPropertiesRecord<IPortModel, PortModel>
  implements $Complete<IPortModel>
{
  public readonly id!: string;
  public readonly name!: string;
  public readonly position!: readonly [number, number];
  public readonly shape: string | undefined = undefined;
  public readonly status: GraphPortStatus | undefined = undefined;
  public readonly isInputDisabled: boolean | undefined = undefined;
  public readonly isOutputDisabled: boolean | undefined = undefined;
  public readonly ariaLabel: string | undefined = undefined;
  public readonly automationId: string | undefined = undefined;
  public readonly properties: ReadonlyProperties = new Properties();

  public static fromJSON(source: ICanvasPort) {
    return new PortModel({
      ...source,
      properties: Properties.from(source.properties),
    });
  }

  public setProperties(properties: ReadonlyProperties): PortModel {
    return this.merge({
      properties,
    });
  }

  public toJSON(): ICanvasPort {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      shape: this.shape,
      status: this.status,
      isInputDisabled: this.isInputDisabled,
      isOutputDisabled: this.isOutputDisabled,
      ariaLabel: this.ariaLabel,
      automationId: this.automationId,
      properties: this.properties.toJSON(),
    };
  }
}
