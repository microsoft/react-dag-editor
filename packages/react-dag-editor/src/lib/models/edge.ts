import { RecordBase } from "record-class";
import record from "record-class/macro";
import { Properties, ReadonlyProperties } from "../property";
import { $Complete } from "../utils/complete";
import { IEntity } from "./entity";
import { $Model } from "./model";
import type { GraphEdgeStatus } from "./status";

export interface ICanvasEdge extends IEntity {
  readonly id: string;
  /**
   * source node id
   */
  readonly source: string;
  /**
   * target node id
   */
  readonly target: string;
  readonly sourcePortId: string;
  readonly targetPortId: string;
  readonly shape?: string;
  readonly status?: GraphEdgeStatus;
  readonly automationId?: string;
}

export interface IEdgeModel extends $Model<ICanvasEdge> {}

export type IEdgeUpdate = (edge: IEdgeModel) => Partial<IEdgeModel>;

@record
export class EdgeModel
  extends RecordBase<IEdgeModel, EdgeModel>
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

  public static fromJSON(value: ICanvasEdge | IEdgeModel): EdgeModel {
    return new EdgeModel({
      ...value,
      properties: Properties.from(value.properties),
    });
  }

  protected override $$create(partial: Partial<IEdgeModel>): EdgeModel {
    return new EdgeModel(partial);
  }
}
