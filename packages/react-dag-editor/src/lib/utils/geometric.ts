import { IPoint, IRectShape } from "../models/geometry";

export const checkRectIntersect = (
  rectA: IRectShape,
  rectB: IRectShape
): boolean => {
  const isALeftOfB = rectA.maxX < rectB.minX;
  const isARightOfB = rectA.minX > rectB.maxX;
  const isABelowB = rectA.minY > rectB.maxY;
  const isAAboveB = rectA.maxY < rectB.minY;

  return !(isALeftOfB || isARightOfB || isABelowB || isAAboveB);
};

export const isPointInRect = (rect: IRectShape, point: IPoint): boolean => {
  const { minX, minY, maxX, maxY } = rect;
  const { x, y } = point;
  return x > minX && x < maxX && y > minY && y < maxY;
};

const square = (x: number): number => Math.pow(x, 2);

export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(square(x2 - x1) + square(y2 - y1));
};

export const getLinearFunction = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): ((x: number) => number) => {
  if (x1 === x2) {
    return () => Number.MAX_SAFE_INTEGER;
  }

  return (x: number) =>
    ((y2 - y1) / (x2 - x1)) * x + (y1 * x2 - y2 * x1) / (x2 - x1);
};

/**
 * (y1 - y2) * x + (x2 - x1) * y + (x1 * y2 - x2 * y1) = 0
 * a = y1 - y2
 * b = -(x2 - x1) = x1 - x2
 * c = -(x1 * y2 - x2 * y1) = x2 * y1 - x1 * y2
 *
 * a * x - b * y = c
 * x = (b * y + c) / a
 * y = (a * x - c) / b
 */
export class LinearEquation {
  private readonly a: number;
  private readonly b: number;
  private readonly c: number;

  public constructor(x1: number, y1: number, x2: number, y2: number) {
    this.a = y1 - y2;
    this.b = x1 - x2;
    this.c = x2 * y1 - x1 * y2;
  }

  public getX(y: number): number | undefined {
    if (this.a === 0) {
      return undefined;
    }
    return (this.b * y + this.c) / this.a;
  }

  public getY(x: number): number | undefined {
    if (this.b === 0) {
      return undefined;
    }
    return (this.a * x - this.c) / this.b;
  }
}
