import record from "record-class/macro";
import {
  IWithPropertiesRecord,
  Properties,
  ReadonlyProperties,
  WithPropertiesRecord,
} from "../properties";
import { $Complete } from "../utils/complete";
import { ICanvasEdge } from "./edge";
import { GraphEdgeStatus } from "./status";

export interface IEdgeModel
  extends Omit<ICanvasEdge, "properties">,
    IWithPropertiesRecord {}

@record
export class EdgeModel
  extends WithPropertiesRecord<IEdgeModel, EdgeModel>
  implements $Complete<IEdgeModel>
{
  public readonly id!: string;
  /**
   * source node id
   */
  public readonly source!: string;
  /**
   * target node id
   */
  public readonly target!: string;
  public readonly sourcePortId!: string;
  public readonly targetPortId!: string;
  public readonly shape: string | undefined = undefined;
  public readonly status: GraphEdgeStatus | undefined = undefined;
  public readonly automationId: string | undefined = undefined;
  public readonly properties: ReadonlyProperties = new Properties();

  public static fromJSON(source: ICanvasEdge): EdgeModel {
    return new EdgeModel({
      ...source,
      properties: Properties.from(source.properties),
    });
  }

  public toJSON(): ICanvasEdge {
    return {
      id: this.id,
      source: this.source,
      target: this.target,
      sourcePortId: this.sourcePortId,
      targetPortId: this.targetPortId,
      shape: this.shape,
      status: this.status,
      automationId: this.automationId,
      properties: this.properties.toJSON(),
    };
  }

  public setProperties(properties: ReadonlyProperties): EdgeModel {
    return this.merge({
      properties,
    });
  }
}
