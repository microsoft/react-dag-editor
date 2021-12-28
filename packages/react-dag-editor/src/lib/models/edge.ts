import { Properties, ReadonlyProperties } from "core";
import { RecordBase } from "record-class";
import record from "record-class/macro";
import { $Complete } from "../utils/complete";
import type { GraphEdgeStatus } from "./status";

export interface ICanvasEdge {
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

export interface IEdgeModel extends ICanvasEdge {
  readonly properties: ReadonlyProperties;
}

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

  protected $$create(partial: Partial<IEdgeModel>): EdgeModel {
    return new EdgeModel(partial);
  }
}
