import { HashMap, OrderedMap } from "../collections";
import { IGraphConfig } from "../contexts";
import { ICanvasEdge, ICanvasNode } from "../Graph.interface";
import { EdgeModel } from "../models/EdgeModel";
import { NodeModel } from "../models/NodeModel";
import { IViewport } from "../models/viewport";
import { IPoint, IRectShape, isPointInRect } from "./geometric";
import { getNodeSize, IShapeRect } from "./layout";
import { getContainerClientPoint, reverseTransformPoint } from "./transformMatrix";

export const isViewPortComplete = (viewPort: IViewport): viewPort is Required<IViewport> => {
  return !!(viewPort.rect && viewPort.visibleRect);
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

export const isNodeVisible = (node: ICanvasNode, viewPort: Required<IViewport>, graphConfig: IGraphConfig): boolean => {
  return isRectVisible(getNodeRect(node, graphConfig), viewPort);
};

export const isRectVisible = (shapeRect: IShapeRect, viewPort: Required<IViewport>) => {
  const { x, y, width, height } = shapeRect;
  return (
    isPointVisible({ x, y }, viewPort) ||
    isPointVisible({ x: x + width, y }, viewPort) ||
    isPointVisible({ x: x + width, y: y + height }, viewPort) ||
    isPointVisible({ x, y: y + height }, viewPort)
  );
};

export const isPointVisible = (point: IPoint, viewPort: Required<IViewport>): boolean => {
  const { x, y } = getContainerClientPoint(point.x, point.y, viewPort);

  const { height, width } = viewPort.visibleRect;

  return x > 0 && x < width && y > 0 && y < height;
};

export const getVisibleNodes = <NodeData, PortData>(
  nodes: OrderedMap<string, NodeModel<NodeData, PortData>>,
  viewPort: Required<IViewport>,
  graphConfig: IGraphConfig
): ICanvasNode[] => {
  const result: ICanvasNode[] = [];

  nodes.forEach(n => {
    if (isNodeVisible(n, viewPort, graphConfig)) {
      result.push(n.inner);
    }
  });

  return result;
};

// Get rendered nodes count
export const getRenderedNodes = <NodeData, PortData>(
  nodes: OrderedMap<string, NodeModel<NodeData, PortData>>,
  viewPort: IViewport
): ICanvasNode[] => {
  const result: ICanvasNode[] = [];

  const renderedArea = getRenderedArea(viewPort);

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
  viewPort: IViewport
) => {
  const result: ICanvasEdge[] = [];
  const renderedArea = getRenderedArea(viewPort);

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

export const getVisibleArea = (viewPort: IViewport): IRectShape => {
  if (!isViewPortComplete(viewPort)) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
  }

  const { rect, visibleRect, transformMatrix } = viewPort;
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

export const getRenderedArea = (viewPort: IViewport): IRectShape => {
  if (!isViewPortComplete(viewPort)) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
  }

  const { rect, visibleRect, transformMatrix } = viewPort;
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
