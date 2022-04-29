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
  readonly properties?: Record<string, unknown>;
}
