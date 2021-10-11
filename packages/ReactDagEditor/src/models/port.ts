import type { GraphPortStatus } from "./status";

export interface ICanvasPortInit<T = unknown> {
  readonly id: string;
  readonly name: string;
  readonly shape?: string;
  readonly status?: GraphPortStatus;
  readonly isInputDisabled?: boolean;
  readonly isOutputDisabled?: boolean;
  readonly ariaLabel?: string;
  readonly data?: Readonly<T>;
  readonly automationId?: string;
}

export interface ICanvasPort<T = unknown> extends ICanvasPortInit<T> {
  /**
   * relative position to node
   */
  readonly position: readonly [number, number];
}
