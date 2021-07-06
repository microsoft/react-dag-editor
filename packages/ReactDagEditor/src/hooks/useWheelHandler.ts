import { RefObject, useLayoutEffect } from "react";
import { GraphCanvasEvent } from "../common/GraphEvent.constant";
import { IDispatch, IGraphConfig } from "../contexts";
import { IContainerRect, IGap } from "../Graph.interface";
import { IPropsAPI } from "../props-api/IPropsAPI";
import { getNodeSize, getRelativePoint } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { noop } from "../utils/noop";
import { normalizeWheelDelta } from "../utils/wheel-delta";

export interface IWheelOptions {
  containerRef: RefObject<HTMLDivElement | undefined>;
  svgRef: RefObject<SVGSVGElement | undefined>;
  rectRef: RefObject<IContainerRect | undefined>;
  zoomSensitivity: number;
  scrollSensitivity: number;
  isVerticalScrollDisabled: boolean;
  isHorizontalScrollDisabled: boolean;
  isCtrlKeyZoomEnable: boolean;
  eventChannel: EventChannel;
  graphConfig: IGraphConfig;
  propsAPI: IPropsAPI;
  dispatch: IDispatch;
  limitBoundary: boolean;
  canvasBoundaryPadding: IGap | undefined;
  groupPadding?: IGap;
}

const THRESHOLD_DISABLE_ZOOM_OUT = 5;

export const useWheelHandler = (args: IWheelOptions) => {
  const {
    containerRef,
    svgRef,
    rectRef,
    zoomSensitivity,
    scrollSensitivity,
    isHorizontalScrollDisabled,
    isVerticalScrollDisabled,
    isCtrlKeyZoomEnable,
    eventChannel,
    graphConfig,
    propsAPI,
    dispatch,
    limitBoundary,
    canvasBoundaryPadding,
    groupPadding
  } = args;

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) {
      return noop;
    }
    const onWheel = (e: WheelEvent) => {
      if (!svg.contains(document.activeElement)) {
        return;
      }

      e.preventDefault();

      if (e.ctrlKey && isCtrlKeyZoomEnable) {
        const deltaY = normalizeWheelDelta(e.deltaMode, e.deltaY);
        const scale = (deltaY > 0 ? -zoomSensitivity : zoomSensitivity) + 1;
        if (scale >= 1 || shouldZoomOut(propsAPI, graphConfig)) {
          eventChannel.trigger({
            type: GraphCanvasEvent.Zoom,
            rawEvent: e,
            scale,
            anchor: getRelativePoint(rectRef.current, e)
          });
        }
        return;
      }

      const rect = rectRef.current;
      if (!rect) {
        return;
      }
      const dx = isHorizontalScrollDisabled
        ? 0
        : -normalizeWheelDelta(e.deltaMode, e.shiftKey ? e.deltaY : e.deltaX) * scrollSensitivity;
      const dy =
        isVerticalScrollDisabled || e.shiftKey ? 0 : -normalizeWheelDelta(e.deltaMode, e.deltaY) * scrollSensitivity;

      eventChannel.trigger({
        type: GraphCanvasEvent.MouseWheelScroll,
        dx,
        dy,
        rawEvent: e,
        groupPadding,
        canvasBoundaryPadding,
        limitBoundary
      });
    };

    container.addEventListener("wheel", onWheel);
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    svgRef,
    rectRef,
    zoomSensitivity,
    scrollSensitivity,
    dispatch,
    isHorizontalScrollDisabled,
    isVerticalScrollDisabled,
    graphConfig,
    eventChannel,
    propsAPI,
    isCtrlKeyZoomEnable,
    limitBoundary,
    groupPadding
  ]);
};

export const shouldZoomOut = (propsAPI: IPropsAPI, graphConfig: IGraphConfig): boolean => {
  const visibleNodes = propsAPI.getVisibleNodes();
  if (!visibleNodes.length) {
    return true;
  }

  let minSize = Infinity;
  visibleNodes.forEach(node => {
    const { width, height } = getNodeSize(node, graphConfig);
    if (height < minSize) {
      minSize = height;
    }
    if (width < minSize) {
      minSize = width;
    }
  });

  const scale = propsAPI.getViewport().transformMatrix[0];

  return !!(minSize * scale > THRESHOLD_DISABLE_ZOOM_OUT);
};
