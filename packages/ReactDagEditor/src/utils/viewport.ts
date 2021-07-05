import { HashMap, OrderedMap } from "../collections";
import { IGraphConfig } from "../contexts";
import { IViewport } from "../contexts/GraphStateContext";
import { ICanvasEdge, ICanvasNode } from "../Graph.interface";
import { EdgeModel } from "../models/EdgeModel";
import { NodeModel } from "../models/NodeModel";
import { IPoint, IRectShape, isPointInRect } from "./geometric";
import { getNodeSize, IShapeRect } from "./layout";
import { getContainerClientPoint, reverseTransformPoint } from "./transformMatrix";

export const isViewportComplete = (viewport: IViewport): viewport is Required<IViewport> => {
  return !!(viewport.rect && viewport.visibleRect);
};

export const getNodeRect = (node: ICanvasNode, graphConfig: IGraphConfig): IShapeRect => {
  const { x, y } = node;
  const { width, height } = getNodeSize(node, graphConfig);
  return {
    x,
    y,
    width,
    height
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

  const { height, width } = viewport.visibleRect;

  return x > 0 && x < width && y > 0 && y < height;
};

export const getVisibleNodes = <NodeData, PortData>(
  nodes: OrderedMap<string, NodeModel<NodeData, PortData>>,
  viewport: Required<IViewport>,
  graphConfig: IGraphConfig
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
  viewport: IViewport
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
  viewport: IViewport
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
      maxY: 0
    };
  }

  const { rect, visibleRect, transformMatrix } = viewport;
  const minX = visibleRect.left - rect.left;
  const minY = visibleRect.top - rect.top;
  const maxX = visibleRect.width + minX; // visibleRect.width + visibleRect.left - rect.left
  const maxY = visibleRect.height + minY; // visibleRect.height + visibleRect.top - rect.top
  const min = reverseTransformPoint(minX, minY, transformMatrix);
  const max = reverseTransformPoint(maxX, maxY, transformMatrix);

  return {
    minX: min.x,
    minY: min.y,
    maxX: max.x,
    maxY: max.y
  };
};

export const getRenderedArea = (viewport: IViewport): IRectShape => {
  if (!isViewportComplete(viewport)) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
  }

  const { rect, visibleRect, transformMatrix } = viewport;
  const minX = visibleRect.left - rect.left;
  const minY = visibleRect.top - rect.top;
  const maxX = visibleRect.width + minX; // visibleRect.width + visibleRect.left - rect.left
  const maxY = visibleRect.height + minY; // visibleRect.height + visibleRect.top - rect.top
  const min = reverseTransformPoint(minX - visibleRect.width, minY - visibleRect.height, transformMatrix);
  const max = reverseTransformPoint(maxX + visibleRect.width, maxY + visibleRect.height, transformMatrix);

  return {
    minX: min.x,
    minY: min.y,
    maxX: max.x,
    maxY: max.y
  };
};

export const getEdgeSourceTargetCoordinate = (
  edge: ICanvasEdge,
  nodes: OrderedMap<string, NodeModel>,
  graphConfig: IGraphConfig
): { source?: IPoint; target?: IPoint } => {
  return {
    source: nodes.get(edge.source)?.getPortPosition(edge.sourcePortId, graphConfig),
    target: nodes.get(edge.target)?.getPortPosition(edge.targetPortId, graphConfig)
  };
};
