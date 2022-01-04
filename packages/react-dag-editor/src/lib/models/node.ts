import type { ICanvasPort } from "./port";
import type { GraphNodeStatus } from "./status";

export interface ICanvasNode {
  readonly shape?: string;
  readonly x: number;
  readonly y: number;
  readonly name?: string;
  readonly id: string;
  readonly status?: GraphNodeStatus;
  readonly height?: number;
  readonly width?: number;
  readonly automationId?: string;
  readonly ports?: ReadonlyArray<ICanvasPort>;
  readonly ariaLabel?: string;
  readonly properties?: Record<string, unknown>;
}
