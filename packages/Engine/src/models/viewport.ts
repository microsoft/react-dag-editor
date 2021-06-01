export type IContainerRect = ClientRect | DOMRect;
export type ITransformMatrix = [number, number, number, number, number, number];

export interface IViewport {
  rect?: IContainerRect;
  visibleRect?: IContainerRect;
  transformMatrix: ITransformMatrix;
}

export const DEFAULT_TRANSFORM_MATRIX: ITransformMatrix = [1, 0, 0, 1, 0, 0];
