import { IGraphConfig, IGraphReducerContext } from "../contexts";
import { EMPTY_TRANSFORM_MATRIX} from "../contexts/GraphStateContext";
import {
  GraphCanvasEvent,
  GraphMinimapEvent,
  GraphScrollBarEvent,
  ICanvasResetViewportEvent,
  ICanvasZoomToFitEvent,
  IEvent
} from "../models/event";
import { IContainerRect, IPoint, IViewport } from "../models/geometry";
import { GraphModel } from "../models/GraphModel";
import {
  clamp,
  getGroupRect,
  getNodeRect,
  getOffsetLimit,
  getZoomFitMatrix,
  IShapePosition,
  IShapeRect,
  isRectVisible,
  isViewportComplete,
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

function resetViewport(
  viewport: IViewport,
  data: GraphModel,
  graphConfig: IGraphConfig,
  action: ICanvasResetViewportEvent
): IViewport {
  if (!isViewportComplete(viewport)) {
    return viewport;
  }

  if (!action.ensureNodeVisible) {
    return {
      ...viewport,
      transformMatrix: EMPTY_TRANSFORM_MATRIX
    };
  }

  const { nodes, groups } = data;

  if (nodes.size === 0) {
    return {
      ...viewport,
      transformMatrix: EMPTY_TRANSFORM_MATRIX
    };
  }

  const isShapeRectInViewport = (r: IShapeRect) => {
    return isRectVisible(r, viewport);
  };

  const nodeRects = nodes.map(n => getNodeRect(n, graphConfig));
  const hasVisibleNode = nodeRects.find(isShapeRectInViewport);

  if (hasVisibleNode) {
    return {
      ...viewport,
      transformMatrix: EMPTY_TRANSFORM_MATRIX
    };
  }

  const groupRects = groups.map(g => getGroupRect(g, nodes, graphConfig));
  const hasVisibleGroup = groupRects.find(isShapeRectInViewport);
  if (hasVisibleGroup) {
    return {
      ...viewport,
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
    ...viewport,
    transformMatrix: [1, 0, 0, 1, -focusNode.x, -focusNode.y]
  };
}

function zoomToFit(
  viewport: IViewport,
  data: GraphModel,
  graphConfig: IGraphConfig,
  action: ICanvasZoomToFitEvent
): IViewport {
  const { rect } = viewport;
  if (!rect) {
    return viewport;
  }
  const transformMatrix = getZoomFitMatrix({
    ...action,
    data,
    graphConfig,
    rect
  });
  return {
    ...viewport,
    transformMatrix
  };
}

const reducer = (viewport: IViewport, action: IEvent, context: IGraphReducerContext, data: GraphModel): IViewport => {
  switch (action.type) {
    case GraphCanvasEvent.ViewportResize:
      return {
        ...viewport,
        rect: action.viewportRect,
        visibleRect: action.visibleRect
      };
    case GraphCanvasEvent.Zoom:
      return zoom(action.scale, action.anchor ?? getRectCenter(viewport.rect), undefined, action.direction)(viewport);
    case GraphScrollBarEvent.Scroll:
    case GraphCanvasEvent.MouseWheelScroll:
    case GraphCanvasEvent.Pan:
    case GraphCanvasEvent.Drag: {
      if (!isViewportComplete(viewport)) {
        return viewport;
      }
      const { transformMatrix, rect } = viewport;
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
      return pan(dx, dy)(viewport);
    }
    case GraphCanvasEvent.Pinch: {
      const { dx, dy, scale, anchor } = action;
      return pipe(pan(dx, dy), zoom(scale, anchor))(viewport);
    }
    case GraphMinimapEvent.Pan:
      return minimapPan(action.dx, action.dy)(viewport);
    case GraphCanvasEvent.ResetViewport:
      return resetViewport(viewport, data, context.graphConfig, action);
    case GraphCanvasEvent.ZoomTo:
      return zoomTo(action.scale, action.anchor ?? getRectCenter(viewport.rect), action.direction)(viewport);
    case GraphCanvasEvent.ZoomToFit:
      return zoomToFit(viewport, data, context.graphConfig, action);
    case GraphCanvasEvent.ScrollIntoView:
      if (viewport.rect) {
        const { x, y } = transformPoint(action.x, action.y, viewport.transformMatrix);
        return scrollIntoView(x, y, viewport.rect, true)(viewport);
      }
      return viewport;
    default:
      return viewport;
  }
};

export const viewportReducer: IBuiltinReducer = (state, action, context) => {
  const viewport = reducer(state.viewport, action, context, state.data.present);
  return viewport === state.viewport
    ? state
    : {
        ...state,
        viewport
      };
};