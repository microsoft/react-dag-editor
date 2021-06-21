import { IPoint } from "./geometric";

export const isWithinThreshold = (
  dx: number,
  dy: number,
  threshold: number
) => {
  return Math.abs(dx) < threshold && Math.abs(dy) < threshold;
};

export const isWithinRect = (
  p0: IPoint,
  p: IPoint,
  w: number,
  h: number
): boolean => {
  const { x: x0, y: y0 } = p0;
  const { x, y } = p;
  if (x0 < x && x0 + w > x && y0 < y && y0 + h > y) {
    return true;
  }
  return false;
};
