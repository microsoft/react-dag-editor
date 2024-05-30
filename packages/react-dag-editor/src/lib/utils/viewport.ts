import type * as React from "react";
import type { HashMap, OrderedMap } from "../collections";
import type { IGraphConfig } from "../models/config/types";
import type { ICanvasEdge } from "../models/edge";
import type { EdgeModel } from "../models/EdgeModel";
import {
  Direction,
  IContainerRect,
  IGap,
  IPoint,
  IRectShape,
  IRectSize,
  ITransformMatrix,
  IViewport,
} from "../models/geometry";
import type { GraphModel } from "../models/GraphModel";
import type { ICanvasNode } from "../models/node";
import type { NodeModel } from "../models/NodeModel";
import type { IGraphSettings } from "../models/state";
import { isPointInRect } from "./geometric";
import { identical } from "./identical";
import { getNodeSize, IShapeRect } from "./layout";
import { getContainerClientPoint, reverseTransformPoint } from "./transformMatrix";

export const isViewportComplete = (viewport: IViewport): viewport is Required<IViewport> => {
  return !!viewport.rect;
};

export const isViewportEmpty = (viewport: IViewport): boolean => {
  if (!isViewportComplete(viewport)) {
    return true;
  }
  return !viewport.rect.width || !viewport.rect.height;
};

export const getNodeRect = (node: ICanvasNode, graphConfig: IGraphConfig): IShapeRect => {
  const { x, y } = node;
  const { width, height } = getNodeSize(node, graphConfig);
  return {
    x,
    y,
    width,
    height,
  };
};

export const isNodeVisible = (node: ICanvasNode, viewport: Required<IViewport>, graphConfig: IGraphConfig): boolean => {
  return isRectVisible(getNodeRect(node, graphConfig), viewport);
};

export const isRectVisible = (shapeRect: IShapeRect, viewport: Required<IViewport>) => {
  const { x, y, width, height } = shapeRect;
  return (
    isPointVisible({ x, y }, viewport) ||
    isPointVisible({ x: x + width, y }, viewport) ||
    isPointVisible({ x: x + width, y: y + height }, viewport) ||
    isPointVisible({ x, y: y + height }, viewport)
  );
};

export const isPointVisible = (point: IPoint, viewport: Required<IViewport>): boolean => {
  const { x, y } = getContainerClientPoint(point.x, point.y, viewport);

  const { height, width } = viewport.rect;

  return x > 0 && x < width && y > 0 && y < height;
};

export const getVisibleNodes = <NodeData, PortData>(
  nodes: OrderedMap<string, NodeModel<NodeData, PortData>>,
  viewport: Required<IViewport>,
  graphConfig: IGraphConfig,
): ICanvasNode[] => {
  const result: ICanvasNode[] = [];

  nodes.forEach(n => {
    if (isNodeVisible(n, viewport, graphConfig)) {
      result.push(n.inner);
    }
  });

  return result;
};

// Get rendered nodes count
export const getRenderedNodes = <NodeData, PortData>(
  nodes: OrderedMap<string, NodeModel<NodeData, PortData>>,
  viewport: IViewport,
): ICanvasNode[] => {
  const result: ICanvasNode[] = [];

  const renderedArea = getRenderedArea(viewport);

  nodes.forEach(n => {
    if (isNodeInRenderedArea(n, renderedArea)) {
      result.push(n.inner);
    }
  });

  return result;
};

const isNodeInRenderedArea = (node: ICanvasNode, renderedArea: IRectShape): boolean => {
  return isPointInRect(renderedArea, node);
};

// Get rendered edges count
export const getRenderedEdges = (
  edges: HashMap<string, EdgeModel>,
  nodes: OrderedMap<string, NodeModel>,
  graphConfig: IGraphConfig,
  viewport: IViewport,
) => {
  const result: ICanvasEdge[] = [];
  const renderedArea = getRenderedArea(viewport);

  edges.forEach(e => {
    const edgeCoordinate = getEdgeSourceTargetCoordinate(e, nodes, graphConfig);
    if (
      edgeCoordinate.source &&
      edgeCoordinate.target &&
      isEdgeInRenderedArea(edgeCoordinate.source, edgeCoordinate.target, renderedArea)
    ) {
      result.push(e.inner);
    }
  });

  return result;
};

const isEdgeInRenderedArea = (source: IPoint, target: IPoint, renderedArea: IRectShape): boolean => {
  const isSourceVisible = isPointInRect(renderedArea, source);
  const isTargetVisible = isPointInRect(renderedArea, target);

  return isSourceVisible || isTargetVisible;
};

export const getVisibleArea = (viewport: IViewport): IRectShape => {
  if (!isViewportComplete(viewport)) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    };
  }

  const { rect, transformMatrix } = viewport;
  const minX = 0;
  const minY = 0;
  const maxX = rect.width;
  const maxY = rect.height;
  const min = reverseTransformPoint(minX, minY, transformMatrix);
  const max = reverseTransformPoint(maxX, maxY, transformMatrix);

  return {
    minX: min.x,
    minY: min.y,
    maxX: max.x,
    maxY: max.y,
  };
};

export const getRenderedArea = (viewport: IViewport): IRectShape => {
  if (!isViewportComplete(viewport)) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    };
  }

  const { rect, transformMatrix } = viewport;
  const minX = 0;
  const minY = 0;
  const maxX = rect.width;
  const maxY = rect.height;
  const min = reverseTransformPoint(minX - rect.width, minY - rect.height, transformMatrix);
  const max = reverseTransformPoint(maxX + rect.width, maxY + rect.height, transformMatrix);

  return {
    minX: min.x,
    minY: min.y,
    maxX: max.x,
    maxY: max.y,
  };
};

export const getEdgeSourceTargetCoordinate = (
  edge: ICanvasEdge,
  nodes: OrderedMap<string, NodeModel>,
  graphConfig: IGraphConfig,
): { source?: IPoint; target?: IPoint } => {
  return {
    source: nodes.get(edge.source)?.getPortPosition(edge.sourcePortId, graphConfig),
    target: nodes.get(edge.target)?.getPortPosition(edge.targetPortId, graphConfig),
  };
};

export interface IZoomCommonParams {
  nodeMinVisibleSize: IRectSize;
  nodeMaxVisibleSize: IRectSize;
}

export interface IZoomFixPublicParams {
  /**
   * zoom vertical
   */
  direction?: Direction;
  /**
   * is disable pan when zoom
   */
  disablePan?: boolean;
  spacing?: number | IGap;
}

const normalizeSpacing = (spacing: number | IGap | undefined): Required<IGap> => {
  if (!spacing) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }
  if (typeof spacing === "number") {
    return {
      top: spacing,
      right: spacing,
      bottom: spacing,
      left: spacing,
    };
  }
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...spacing,
  };
};

export interface IZoomFitParams extends IZoomFixPublicParams, IZoomCommonParams {
  data: GraphModel;
  graphConfig: IGraphConfig;
  rect: IContainerRect;
}

type Action = (viewport: IViewport) => IViewport;

/**
 * @param scale the scale to zoom to
 * @param anchor this client point is not moved after zoom
 * @param direction X: zoom horizontal, Y: zoom vertical
 */
export interface IZoomParams {
  scale: number;
  anchor: IPoint;
  direction?: Direction;
  limitScale(scale: number): number;
}

/**
 * zoom to [scale]
 */
export const zoomTo = ({ scale, anchor, direction, limitScale }: IZoomParams): Action => {
  return prevState => {
    const scaleX = limitScale(scale) / prevState.transformMatrix[0];
    const scaleY = limitScale(scale) / prevState.transformMatrix[3];
    const { x, y } = anchor;
    const dx = x * (1 - scaleX);
    const dy = y * (1 - scaleY);

    let transformMatrix: ITransformMatrix;
    switch (direction) {
      case Direction.X:
        transformMatrix = [
          scale,
          0,
          0,
          prevState.transformMatrix[3],
          prevState.transformMatrix[4] * scaleX + dx,
          prevState.transformMatrix[5],
        ];
        break;
      case Direction.Y:
        transformMatrix = [
          prevState.transformMatrix[0],
          0,
          0,
          scale,
          prevState.transformMatrix[4],
          prevState.transformMatrix[5] * scaleY + dy,
        ];
        break;
      case Direction.XY:
      default:
        transformMatrix = [
          scale,
          0,
          0,
          scale,
          prevState.transformMatrix[4] * scaleX + dx,
          prevState.transformMatrix[5] * scaleY + dy,
        ];
    }
    return {
      ...prevState,
      transformMatrix,
    };
  };
};

export const zoom = ({ scale, anchor, direction, limitScale }: IZoomParams): Action => {
  if (scale === 1) {
    return identical;
  }

  return prevState => {
    let transformMatrix: ITransformMatrix;
    switch (direction) {
      case Direction.X:
        return zoomTo({
          anchor,
          direction,
          limitScale,
          scale: prevState.transformMatrix[0] * scale,
        })(prevState);
      case Direction.Y:
        return zoomTo({
          anchor,
          direction,
          limitScale,
          scale: prevState.transformMatrix[3] * scale,
        })(prevState);
      case Direction.XY:
      default: {
        const resultX = limitScale(prevState.transformMatrix[0] * scale);
        const resultY = limitScale(prevState.transformMatrix[3] * scale);
        const scaleX = resultX / prevState.transformMatrix[0];
        const scaleY = resultY / prevState.transformMatrix[3];
        const { x, y } = anchor;
        const dx = x * (1 - scaleX);
        const dy = y * (1 - scaleY);
        transformMatrix = [
          resultX,
          0,
          0,
          resultY,
          prevState.transformMatrix[4] * scaleX + dx,
          prevState.transformMatrix[5] * scaleY + dy,
        ];
      }
    }
    return {
      ...prevState,
      transformMatrix,
    };
  };
};

export const pan = (dx: number, dy: number): Action => {
  if (dx === 0 && dy === 0) {
    return identical;
  }
  return prevState => {
    return {
      ...prevState,
      transformMatrix: [
        prevState.transformMatrix[0],
        prevState.transformMatrix[1],
        prevState.transformMatrix[2],
        prevState.transformMatrix[3],
        prevState.transformMatrix[4] + dx,
        prevState.transformMatrix[5] + dy,
      ],
    };
  };
};
export const minimapPan = (dx: number, dy: number): Action => {
  if (dx === 0 && dy === 0) {
    return identical;
  }
  return prevState => {
    const [a, b, c, d] = prevState.transformMatrix;
    return {
      ...prevState,
      transformMatrix: [
        a,
        b,
        c,
        d,
        prevState.transformMatrix[4] + a * dx + b * dy,
        prevState.transformMatrix[5] + c * dx + d * dy,
      ],
    };
  };
};

export const getContentArea = (data: GraphModel, graphConfig: IGraphConfig, nodeIds?: Set<string>) => {
  let minNodeWidth = Infinity;
  let minNodeHeight = Infinity;
  let minNodeX = Infinity;
  let minNodeY = Infinity;
  let maxNodeX = -Infinity;
  let maxNodeY = -Infinity;

  type Fn = (node: NodeModel) => void;

  const forEachNode = (fn: Fn) => data.nodes.forEach(fn);
  const forEachByIds = (fn: Fn) =>
    nodeIds?.forEach(id => {
      const node = data.nodes.get(id);
      if (node) {
        fn(node);
      }
    });

  const forEach = nodeIds === undefined ? forEachNode : forEachByIds;

  forEach(node => {
    const { width: nodeWidth, height: nodeHeight } = getNodeSize(node, graphConfig);

    if (node.x < minNodeX) {
      minNodeX = node.x;
    }
    if (node.y < minNodeY) {
      minNodeY = node.y;
    }
    if (node.x + nodeWidth > maxNodeX) {
      maxNodeX = node.x + nodeWidth;
    }
    if (node.y + nodeHeight > maxNodeY) {
      maxNodeY = node.y + nodeHeight;
    }
    if (nodeWidth < minNodeWidth) {
      minNodeWidth = nodeWidth;
    }
    if (nodeHeight < minNodeHeight) {
      minNodeHeight = nodeHeight;
    }
  });

  return {
    minNodeWidth,
    minNodeHeight,
    minNodeX,
    minNodeY,
    maxNodeX,
    maxNodeY,
  };
};

const normalizeNodeVisibleMinMax = ({ nodeMinVisibleSize, nodeMaxVisibleSize }: IZoomCommonParams) => {
  let { width: nodeMinVisibleWidth, height: nodeMinVisibleHeight } = nodeMinVisibleSize;
  let { width: nodeMaxVisibleWidth, height: nodeMaxVisibleHeight } = nodeMaxVisibleSize;
  if (nodeMinVisibleWidth > nodeMaxVisibleWidth) {
    const temp = nodeMinVisibleWidth;
    nodeMinVisibleWidth = nodeMaxVisibleWidth;
    nodeMaxVisibleWidth = temp;
  }
  if (nodeMinVisibleHeight > nodeMaxVisibleHeight) {
    const temp = nodeMinVisibleHeight;
    nodeMinVisibleHeight = nodeMaxVisibleHeight;
    nodeMaxVisibleHeight = temp;
  }
  return {
    nodeMinVisibleWidth,
    nodeMinVisibleHeight,
    nodeMaxVisibleWidth,
    nodeMaxVisibleHeight,
  };
};

export const getScaleRange = (params: IZoomCommonParams, { width: minNodeWidth, height: minNodeHeight }: IRectSize) => {
  const { nodeMinVisibleWidth, nodeMinVisibleHeight, nodeMaxVisibleWidth, nodeMaxVisibleHeight } =
    normalizeNodeVisibleMinMax(params);
  let minScaleX = 0;
  let minScaleY = 0;
  let maxScaleX = Infinity;
  let maxScaleY = Infinity;
  if (minNodeWidth) {
    minScaleX = nodeMinVisibleWidth / minNodeWidth;
    maxScaleX = nodeMaxVisibleWidth / minNodeWidth;
  }
  if (minNodeHeight) {
    minScaleY = nodeMinVisibleHeight / minNodeHeight;
    maxScaleY = nodeMaxVisibleHeight / minNodeHeight;
  }
  return {
    minScaleX,
    minScaleY,
    maxScaleX,
    maxScaleY,
  };
};

export const getZoomFitMatrix = (args: IZoomFitParams): ITransformMatrix => {
  const { data, graphConfig, disablePan, direction, rect } = args;

  const { nodes } = data;

  // istanbul ignore next
  if (nodes.size === 0) {
    return [1, 0, 0, 1, 0, 0];
  }

  const { minNodeWidth, minNodeHeight, minNodeX, minNodeY, maxNodeX, maxNodeY } = getContentArea(data, graphConfig);

  const { minScaleX, minScaleY, maxScaleX, maxScaleY } = getScaleRange(args, {
    width: minNodeWidth,
    height: minNodeHeight,
  });

  const spacing = normalizeSpacing(args.spacing);
  const { width, height } = rect;
  const scaleX = width / (maxNodeX - minNodeX + spacing.left + spacing.right);
  const scaleY = height / (maxNodeY - minNodeY + spacing.top + spacing.bottom);

  const scaleCommon =
    direction === Direction.Y
      ? Math.min(Math.max(minScaleX, minScaleY, scaleY), maxScaleX, maxScaleY)
      : Math.min(Math.max(minScaleX, minScaleY, Math.min(scaleX, scaleY)), maxScaleY, maxScaleY);

  const newScaleX = direction === Direction.XY ? Math.min(Math.max(minScaleX, scaleX), maxScaleX) : scaleCommon;
  const newScaleY = direction === Direction.XY ? Math.min(Math.max(minScaleY, scaleY), maxScaleY) : scaleCommon;

  if (disablePan) {
    return [newScaleX, 0, 0, newScaleY, 0, 0];
  }

  const dx = -newScaleX * (minNodeX - spacing.left);
  const dy = -newScaleY * (minNodeY - spacing.top);

  const visibleNodes = getVisibleNodes(
    data.nodes,
    {
      rect,
      transformMatrix: [newScaleX, 0, 0, newScaleY, dx, dy],
    },
    graphConfig,
  );

  if (visibleNodes.length > 0) {
    return [newScaleX, 0, 0, newScaleY, dx, dy];
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let focusNode = data.nodes.first()!;
  if (focusNode) {
    data.nodes.forEach(node => {
      if (focusNode.y > node.y) {
        focusNode = node;
      }
    });
  }

  return [
    newScaleX,
    0,
    0,
    newScaleY,
    -newScaleX * (focusNode.x - spacing.left),
    -newScaleY * (focusNode.y - spacing.top),
  ];
};

export const focusArea = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  viewport: Required<IViewport>,
): IViewport => {
  const width = maxX - minX;
  const height = maxY - minY;

  const scale = Math.min(viewport.rect.width / width, viewport.rect.height / height);

  const dx = -scale * (minX + width / 2) + viewport.rect.width / 2;
  const dy = -scale * (minY + height / 2) + viewport.rect.height / 2;

  return {
    ...viewport,
    transformMatrix: [scale, 0, 0, scale, dx, dy],
  };
};
export const getContainer = (svgRef: React.RefObject<SVGSVGElement>) =>
  svgRef.current?.closest<HTMLDivElement>(".react-dag-editor-container");

/**
 * @param rectRef
 */
export function getContainerCenter(rectRef: React.RefObject<IContainerRect | undefined>): IPoint | undefined {
  const rect = rectRef.current;
  if (!rect) {
    return undefined;
  }
  const x = rect.width / 2;
  const y = rect.height / 2;
  return {
    x,
    y,
  };
}

/**
 * @param rect
 * @param e
 */
export function getRelativePoint(rect: IContainerRect, e: MouseEvent): IPoint {
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return {
    x,
    y,
  };
}

// scroll the (x,y) to the center of the viewport, or to the specific position if provide
export const scrollIntoView = (
  x: number,
  y: number,
  rect: IContainerRect | undefined | null,
  alwaysScroll?: boolean,
  position?: IPoint,
): Action => {
  // istanbul ignore next
  if (!rect) {
    return identical;
  }
  const { width, height } = rect;
  const shouldScroll = x < 0 || x > width || y < 0 || y > height;

  if (!shouldScroll && !alwaysScroll) {
    return identical;
  }

  return prevState => {
    const dx = position ? position.x - x : width / 2 - x;
    const dy = position ? position.y - y : height / 2 - y;

    return {
      ...prevState,
      transformMatrix: [
        prevState.transformMatrix[0],
        prevState.transformMatrix[1],
        prevState.transformMatrix[2],
        prevState.transformMatrix[3],
        prevState.transformMatrix[4] + dx,
        prevState.transformMatrix[5] + dy,
      ],
    };
  };
};

export const getScaleLimit = (data: GraphModel, settings: IGraphSettings) => {
  const { minNodeWidth, minNodeHeight } = getContentArea(data, settings.graphConfig);

  const { minScaleX, minScaleY } = getScaleRange(settings, {
    width: minNodeWidth,
    height: minNodeHeight,
  });

  return Math.max(minScaleX, minScaleY);
};
