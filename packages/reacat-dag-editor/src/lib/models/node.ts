import type { ICanvasPort } from "./port";
import type { GraphNodeStatus } from "./status";

export interface ICanvasNode<T = unknown, P = unknown> {
  readonly x: number;
  readonly y: number;
  readonly name?: string;
  readonly id: string;
  readonly status?: GraphNodeStatus;
  readonly height?: number;
  readonly width?: number;
  readonly automationId?: string;
  readonly isInSearchResults?: boolean;
  readonly isCurrentSearchResult?: boolean;
  readonly ports?: ReadonlyArray<ICanvasPort<P>>;
  readonly ariaLabel?: string;
  readonly data?: Readonly<T>;
  readonly layer?: number;
}
