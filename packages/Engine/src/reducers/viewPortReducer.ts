import { GraphCanvasEvent, GraphMinimapEvent, GraphScrollBarEvent } from "../common/GraphEvent.constant";
import { IGraphConfig, IGraphReducerContext } from "../contexts";
import { EMPTY_TRANSFORM_MATRIX, IViewPort } from "../contexts/GraphStateContext";
import { ICanvasResetViewPortEvent, ICanvasZoomToFitEvent, IContainerRect, IEvent } from "../Graph.interface";
import { GraphModel } from "../models/GraphModel";
import {
  clamp,
  getGroupRect,
  getNodeRect,
  getOffsetLimit,
  getZoomFitMatrix,
  IPoint,
  IShapePosition,
  IShapeRect,
  isRectVisible,
  isViewPortComplete,
  minimapPan,
  pan,
  scrollIntoView,
  transformPoint,
  zoom,
  zoomTo
} from "../utils";
import { pipe } from "../utils/pipe";
import { IBuiltinReducer } from "./builtinReducer.type";

function getRectCenter(rect: IContainerRect | undefined): IPoint | undefined {
  if (!rect) {
    return undefined;
  }
  return {
    x: rect.width / 2,
    y: rect.height / 2
  };
}

function resetViewPort(
  viewPort: IViewPort,
  data: GraphModel,
  graphConfig: IGraphConfig,
  action: ICanvasResetViewPortEvent
): IViewPort {
  if (!isViewPortComplete(viewPort)) {
    return viewPort;
  }

  if (!action.ensureNodeVisible) {
    return {
      ...viewPort,
      transformMatrix: EMPTY_TRANSFORM_MATRIX
    };
  }

  const { nodes, groups } = data;

  if (nodes.size === 0) {
    return {
      ...viewPort,
      transformMatrix: EMPTY_TRANSFORM_MATRIX
    };
  }

  const isShapeRectInViewPort = (r: IShapeRect) => {
    return isRectVisible(r, viewPort);
  };

  const nodeRects = nodes.map(n => getNodeRect(n, graphConfig));
  const hasVisibleNode = nodeRects.find(isShapeRectInViewPort);

  if (hasVisibleNode) {
    return {
      ...viewPort,
      transformMatrix: EMPTY_TRANSFORM_MATRIX
    };
  }

  const groupRects = groups.map(g => getGroupRect(g, nodes, graphConfig));
  const hasVisibleGroup = groupRects.find(isShapeRectInViewPort);
  if (hasVisibleGroup) {
    return {
      ...viewPort,
      transformMatrix: EMPTY_TRANSFORM_MATRIX
    };
  }

  let focusNode: IShapePosition = nodeRects.first()!;
  const findTopMostRect = (cur: IShapeRect) => {
    if (focusNode.y > cur.y) {
      focusNode = cur;
    }
  };
  nodeRects.forEach(findTopMostRect);
  groupRects.forEach(findTopMostRect);

  return {
    ...viewPort,
    transformMatrix: [1, 0, 0, 1, -focusNode.x, -focusNode.y]
  };
}

function zoomToFit(
  viewPort: IViewPort,
  data: GraphModel,
  graphConfig: IGraphConfig,
  action: ICanvasZoomToFitEvent
): IViewPort {
  const { rect } = viewPort;
  if (!rect) {
    return viewPort;
  }
  const transformMatrix = getZoomFitMatrix({
    ...action,
    data,
    graphConfig,
    rect
  });
  return {
    ...viewPort,
    transformMatrix
  };
}

const reducer = (viewPort: IViewPort, action: IEvent, context: IGraphReducerContext, data: GraphModel): IViewPort => {
  switch (action.type) {
    case GraphCanvasEvent.ViewPortResize:
      return {
        ...viewPort,
        rect: action.viewPortRect,
        visibleRect: action.visibleRect
      };
    case GraphCanvasEvent.Zoom:
      return zoom(action.scale, action.anchor ?? getRectCenter(viewPort.rect), undefined, action.direction)(viewPort);
    case GraphScrollBarEvent.Scroll:
    case GraphCanvasEvent.MouseWheelScroll:
    case GraphCanvasEvent.Pan:
    case GraphCanvasEvent.Drag: {
      if (!isViewPortComplete(viewPort)) {
        return viewPort;
      }
      const { transformMatrix, rect } = viewPort;
      let { dx, dy } = action;
      const { limitBoundary, groupPadding, canvasBoundaryPadding } = action;
      if (limitBoundary) {
        const { minX, maxX, minY, maxY } = getOffsetLimit({
          data,
          graphConfig: context.graphConfig,
          rect,
          transformMatrix,
          canvasBoundaryPadding,
          groupPadding
        });
        dx = clamp(minX - transformMatrix[4], maxX - transformMatrix[4], dx);
        dy = clamp(minY - transformMatrix[5], maxY - transformMatrix[5], dy);
      }
      return pan(dx, dy)(viewPort);
    }
    case GraphCanvasEvent.Pinch: {
      const { dx, dy, scale, anchor } = action;
      return pipe(pan(dx, dy), zoom(scale, anchor))(viewPort);
    }
    case GraphMinimapEvent.Pan:
      return minimapPan(action.dx, action.dy)(viewPort);
    case GraphCanvasEvent.ResetViewPort:
      return resetViewPort(viewPort, data, context.graphConfig, action);
    case GraphCanvasEvent.ZoomTo:
      return zoomTo(action.scale, action.anchor ?? getRectCenter(viewPort.rect), action.direction)(viewPort);
    case GraphCanvasEvent.ZoomToFit:
      return zoomToFit(viewPort, data, context.graphConfig, action);
    case GraphCanvasEvent.ScrollIntoView:
      if (viewPort.rect) {
        const { x, y } = transformPoint(action.x, action.y, viewPort.transformMatrix);
        return scrollIntoView(x, y, viewPort.rect, true)(viewPort);
      }
      return viewPort;
    default:
      return viewPort;
  }
};

export const viewPortReducer: IBuiltinReducer = (state, action, context) => {
  const viewPort = reducer(state.viewPort, action, context, state.data.present);
  return viewPort === state.viewPort
    ? state
    : {
        ...state,
        viewPort
      };
};
