import { INodeGeometryDelta } from "./GraphModel";

/**
 * @internal
 */
export interface IDummyNode {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface IDummyNodes extends INodeGeometryDelta {
  nodes: IDummyNode[];
  isVisible: boolean;
  alignedDX: number | undefined;
  alignedDY: number | undefined;
}
