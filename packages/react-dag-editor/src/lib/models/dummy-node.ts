import { INodeGeometryChange } from "../node-utils";

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

export interface IDummyNodes extends INodeGeometryChange {
  nodes: IDummyNode[];
  isVisible: boolean;
  alignedDX: number | undefined;
  alignedDY: number | undefined;
}

export const emptyDummyNodes = (): IDummyNodes => ({
  dx: 0,
  dy: 0,
  dWidth: 0,
  dHeight: 0,
  alignedDX: undefined,
  alignedDY: undefined,
  nodes: [],
  isVisible: false,
});
