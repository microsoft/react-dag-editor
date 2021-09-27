import type { IGraphReactReducer } from "../contexts";
import { EMPTY_TRANSFORM_MATRIX } from "../createGraphState";
import { GraphFeatures } from "../Features";
import type { IGraphConfig } from "../models/config/types";
import {
  GraphCanvasEvent,
  GraphMinimapEvent,
  GraphScrollBarEvent,
  ICanvasResetViewportEvent,
  ICanvasZoomToFitEvent,
  IEvent,
} from "../models/event";
import type { IContainerRect, IPoint, IViewport } from "../models/geometry";
import { GraphModel } from "../models/GraphModel";
import type { IGraphSettings } from "../models/state";
import {
  clamp,
  getGroupRect,
  getNodeRect,
  getOffsetLimit,
  getScaleLimit,
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
  zoomTo,
} from "../utils";
import { pipe } from "../utils/pipe";

function getRectCenter(rect: IContainerRect): IPoint {
  return {
    x: rect.width / 2,
    y: rect.height / 2,
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
      transformMatrix: EMPTY_TRANSFORM_MATRIX,
    };
  }

  const { nodes, groups } = data;

  if (nodes.size === 0) {
    return {
      ...viewport,
      transformMatrix: EMPTY_TRANSFORM_MATRIX,
    };
  }

  const isShapeRectInViewport = (r: IShapeRect) => {
    return isRectVisible(r, viewport);
  };

  const nodeRects = nodes.map((n) => getNodeRect(n, graphConfig));
  const hasVisibleNode = nodeRects.find(isShapeRectInViewport);

  if (hasVisibleNode) {
    return {
      ...viewport,
      transformMatrix: EMPTY_TRANSFORM_MATRIX,
    };
  }

  const groupRects = groups.map((g) => getGroupRect(g, nodes, graphConfig));
  const hasVisibleGroup = groupRects.find(isShapeRectInViewport);
  if (hasVisibleGroup) {
    return {
      ...viewport,
      transformMatrix: EMPTY_TRANSFORM_MATRIX,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    transformMatrix: [1, 0, 0, 1, -focusNode.x, -focusNode.y],
  };
}

function zoomToFit(
  viewport: IViewport,
  data: GraphModel,
  settings: IGraphSettings,
  action: ICanvasZoomToFitEvent
): IViewport {
  if (!isViewportComplete(viewport)) {
    return viewport;
  }
  const { graphConfig, nodeMaxVisibleSize, nodeMinVisibleSize } = settings;
  const transformMatrix = getZoomFitMatrix({
    ...action,
    data,
    graphConfig,
    rect: viewport.rect,
    nodeMaxVisibleSize,
    nodeMinVisibleSize,
  });
  return {
    ...viewport,
    transformMatrix,
  };
}

const reducer = (viewport: IViewport, action: IEvent, data: GraphModel, settings: IGraphSettings): IViewport => {
  const { graphConfig, canvasBoundaryPadding, features } = settings;
  const limitScale = (scale: number) => {
    return Math.max(scale, getScaleLimit(data, settings));
  };
  switch (action.type) {
    case GraphCanvasEvent.ViewportResize:
      return {
        ...viewport,
        rect: action.viewportRect,
      };
    case GraphCanvasEvent.Zoom:
      if (!isViewportComplete(viewport)) {
        return viewport;
      }
      return zoom({
        scale: action.scale,
        anchor: action.anchor ?? getRectCenter(viewport.rect),
        direction: action.direction,
        limitScale,
      })(viewport);
    case GraphScrollBarEvent.Scroll:
    case GraphCanvasEvent.MouseWheelScroll:
    case GraphCanvasEvent.Pan:
    case GraphCanvasEvent.Drag: {
      if (!isViewportComplete(viewport)) {
        return viewport;
      }
      const { transformMatrix, rect } = viewport;
      let { dx, dy } = action;
      const limitBoundary = features.has(GraphFeatures.limitBoundary);
      const groupPadding = data.groups?.[0]?.padding; // TODO: this is not precise
      if (limitBoundary) {
        const { minX, maxX, minY, maxY } = getOffsetLimit({
          data,
          graphConfig,
          rect,
          transformMatrix,
          canvasBoundaryPadding,
          groupPadding,
        });
        dx = clamp(minX - transformMatrix[4], maxX - transformMatrix[4], dx);
        dy = clamp(minY - transformMatrix[5], maxY - transformMatrix[5], dy);
      }
      return pan(dx, dy)(viewport);
    }
    case GraphCanvasEvent.Pinch: {
      const { dx, dy, scale, anchor } = action;
      return pipe(
        pan(dx, dy),
        zoom({
          scale,
          anchor,
          limitScale,
        })
      )(viewport);
    }
    case GraphMinimapEvent.Pan:
      return minimapPan(action.dx, action.dy)(viewport);
    case GraphCanvasEvent.ResetViewport:
      return resetViewport(viewport, data, graphConfig, action);
    case GraphCanvasEvent.ZoomTo:
      if (!isViewportComplete(viewport)) {
        return viewport;
      }
      return zoomTo({
        scale: action.scale,
        anchor: action.anchor ?? getRectCenter(viewport.rect),
        direction: action.direction,
        limitScale,
      })(viewport);
    case GraphCanvasEvent.ZoomToFit:
      return zoomToFit(viewport, data, settings, action);
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

export const viewportReducer: IGraphReactReducer = (state, action) => {
  const viewport = reducer(state.viewport, action, state.data.present, state.settings);
  return viewport === state.viewport
    ? state
    : {
        ...state,
        viewport,
      };
};
