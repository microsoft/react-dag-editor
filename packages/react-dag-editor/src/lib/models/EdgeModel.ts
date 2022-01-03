import { RecordBase } from "record-class";
import { $Complete } from "../utils/complete";
import { ICanvasEdge } from "./edge";
import { GraphEdgeStatus } from "./status";

export class EdgeModel<T = unknown>
  extends RecordBase<ICanvasEdge<T>, EdgeModel<T>>
  implements $Complete<ICanvasEdge<T>>
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
  public readonly data: Readonly<T> | undefined = undefined;

  public static fromJSON<T = unknown>(source: ICanvasEdge<T>): EdgeModel<T> {
    return new EdgeModel(source);
  }

  protected $$create(partial: ICanvasEdge<T>): EdgeModel<T> {
    return new EdgeModel(partial);
  }
}
