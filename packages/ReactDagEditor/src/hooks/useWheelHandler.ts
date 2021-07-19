import { RefObject, useLayoutEffect } from "react";
import { IDispatch, IGraphConfig } from "../contexts";
import { GraphCanvasEvent } from "../models/event";
import { IContainerRect } from "../models/geometry";
import { getRelativePoint } from "../utils";
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
  dispatch: IDispatch;
}

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
    dispatch
  } = args;

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) {
      return noop;
    }
    const onWheel = (e: WheelEvent) => {
      const rect = rectRef.current;
      if (!rect) {
        return;
      }
      if (!svg.contains(document.activeElement)) {
        return;
      }

      e.preventDefault();

      if (e.ctrlKey && isCtrlKeyZoomEnable) {
        const deltaY = normalizeWheelDelta(e.deltaMode, e.deltaY);
        const scale = (deltaY > 0 ? -zoomSensitivity : zoomSensitivity) + 1;
        eventChannel.trigger({
          type: GraphCanvasEvent.Zoom,
          rawEvent: e,
          scale,
          anchor: getRelativePoint(rect, e)
        });
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
        rawEvent: e
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
    isCtrlKeyZoomEnable
  ]);
};
