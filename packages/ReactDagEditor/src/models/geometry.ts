export interface IRectShape {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IGap {
  readonly top?: number;
  readonly bottom?: number;
  readonly left?: number;
  readonly right?: number;
}

export type ITransformMatrix = [number, number, number, number, number, number];

export type IContainerRect = ClientRect | DOMRect;

export interface IViewport {
  rect?: IContainerRect;
  visibleRect?: IContainerRect;
  transformMatrix: ITransformMatrix;
}

export enum Direction {
  X,
  Y,
  /**
   * zoom to fit in the X and Y directions, maybe the scaleX and the scaleY will different
   */
  XY
}
