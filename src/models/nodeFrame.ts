import type { INodeGeometryDelta } from "./GraphModel";

/**
 * @internal
 */
export interface INodeFrame {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface INodeFrames extends INodeGeometryDelta {
  nodes: INodeFrame[];
  isVisible: boolean;
  alignedDX: number | undefined;
  alignedDY: number | undefined;
}

export const emptyNodeFrames = (): INodeFrames => ({
  dx: 0,
  dy: 0,
  dWidth: 0,
  dHeight: 0,
  alignedDX: undefined,
  alignedDY: undefined,
  nodes: [],
  isVisible: false
});
