import { createContext } from "react";
import { EMPTY_TRANSFORM_MATRIX } from "../createGraphState";
import { IContainerRect, IRectShape, IViewport } from "../models/geometry";

export interface IVirtualizationContext {
  viewport: Required<IViewport>;
  visibleArea: IRectShape;
  renderedArea: IRectShape;
  renderedNodes: Set<string>;
  renderedEdges: Set<string>;
  timestamp: number;
}

const EMPTY_RECT = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  toJSON(): IContainerRect {
    return this;
  },
};

export const VirtualizationContext = createContext<IVirtualizationContext>({
  viewport: {
    rect: EMPTY_RECT,
    transformMatrix: EMPTY_TRANSFORM_MATRIX,
  },
  renderedArea: {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  },
  visibleArea: {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  },
  renderedNodes: new Set(),
  renderedEdges: new Set(),
  timestamp: 0,
});
