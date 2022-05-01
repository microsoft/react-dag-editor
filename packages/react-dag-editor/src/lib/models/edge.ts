import type { GraphEdgeStatus } from "./status";

export interface ICanvasEdge<T = unknown> {
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
  readonly data?: Readonly<T>;
  readonly automationId?: string;
}
