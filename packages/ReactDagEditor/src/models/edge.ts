import { GraphEdgeState } from "./element-state";

export interface ICanvasEdge<T = unknown> {
  readonly shape?: string;
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
  readonly id: string;
  readonly state?: GraphEdgeState;
  readonly data?: Readonly<T>;
  readonly automationId?: string;
}
