import { IPoint, ITransformMatrix, IViewport } from "../models/geometry";

/**
 * get transformed point
 * @param x
 * @param y
 * @param transformMatrix
 */
export const transformPoint = (
  x: number,
  y: number,
  transformMatrix: ITransformMatrix
): IPoint => {
  return {
    x: transformMatrix[0] * x + transformMatrix[2] * y + transformMatrix[4],
    y: transformMatrix[1] * x + transformMatrix[3] * y + transformMatrix[5],
  };
};

/**
 * reverse of transformPoint
 * @param x
 * @param y
 * @param transformMatrix
 */
export const reverseTransformPoint = (
  x: number,
  y: number,
  transformMatrix: ITransformMatrix
): IPoint => {
  const [t0, t1, t2, t3, t4, t5] = transformMatrix;
  return {
    x: ((x - t4) * t3 - (y - t5) * t2) / (t0 * t3 - t1 * t2),
    y: ((x - t4) * t1 - (y - t5) * t0) / (t1 * t2 - t0 * t3),
  };
};

export const getPointDeltaByClientDelta = (
  x: number,
  y: number,
  transformMatrix: ITransformMatrix
): IPoint => {
  const [a, b, c, d] = transformMatrix;
  const realDx = (d * x) / (a * d - b * c) + (c * y) / (b * c - a * d);
  const realDy = (b * x) / (b * c - a * d) + (a * y) / (a * d - b * c);
  return {
    x: realDx,
    y: realDy,
  };
};

export const getClientDeltaByPointDelta = (
  x: number,
  y: number,
  transformMatrix?: ITransformMatrix
) => {
  if (!transformMatrix) {
    return {
      x,
      y,
    };
  }
  const [a, b, c, d] = transformMatrix;
  return transformPoint(x, y, [a, b, c, d, 0, 0]);
};

export const getRealPointFromClientPoint = (
  clientX: number,
  clientY: number,
  viewport: Required<IViewport>
): IPoint => {
  const { rect } = viewport;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  return reverseTransformPoint(x, y, viewport.transformMatrix);
};

export const getClientPointFromRealPoint = (
  realX: number,
  realY: number,
  viewport: Required<IViewport>
): IPoint => {
  const { x, y } = transformPoint(realX, realY, viewport.transformMatrix);
  const { rect } = viewport;
  return {
    x: x + rect.left,
    y: y + rect.top,
  };
};

/**
 * get client point relative to container
 */
export const getContainerClientPoint = (
  realX: number,
  realY: number,
  viewport: Required<IViewport>
) => {
  const client = getClientPointFromRealPoint(realX, realY, viewport);
  const { rect } = viewport;
  return {
    x: client.x - rect.left,
    y: client.y - rect.top,
  };
};
