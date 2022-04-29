import type { GraphPortStatus } from "./status";

export interface ICanvasPortInit {
  readonly id: string;
  readonly name: string;
  readonly shape?: string;
  readonly status?: GraphPortStatus;
  readonly isInputDisabled?: boolean;
  readonly isOutputDisabled?: boolean;
  readonly ariaLabel?: string;
  readonly automationId?: string;
  readonly properties?: Record<string, unknown>;
}

export interface ICanvasPort extends ICanvasPortInit {
  /**
   * relative position to node
   */
  readonly position: readonly [number, number];
}
