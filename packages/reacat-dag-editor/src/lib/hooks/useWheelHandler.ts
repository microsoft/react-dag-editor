import { RefObject, useLayoutEffect } from "react";
import { IDispatch } from "../contexts";
import type { IGraphConfig } from "../models/config/types";
import { GraphCanvasEvent } from "../models/event";
import type { IContainerRect } from "../models/geometry";
import { getRelativePoint } from "../utils";
import type { EventChannel } from "../utils/eventChannel";
import { noop } from "../utils/noop";
import { normalizeWheelDelta } from "../utils/wheel-delta";
import { useGraphController } from "./context";

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

let shouldRespondWheel = false;

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
    dispatch,
  } = args;

  const graphController = useGraphController();
  const globalEventTarget = graphController.getGlobalEventTarget();

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

      if (!shouldRespondWheel) {
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
          anchor: getRelativePoint(rect, e),
        });
        return;
      }

      const dx = isHorizontalScrollDisabled
        ? 0
        : -normalizeWheelDelta(e.deltaMode, e.shiftKey ? e.deltaY : e.deltaX) *
          scrollSensitivity;
      const dy =
        isVerticalScrollDisabled || e.shiftKey
          ? 0
          : -normalizeWheelDelta(e.deltaMode, e.deltaY) * scrollSensitivity;

      eventChannel.trigger({
        type: GraphCanvasEvent.MouseWheelScroll,
        dx,
        dy,
        rawEvent: e,
      });
    };

    const mouseEnterHandler = () => {
      shouldRespondWheel = true;
    };

    container.addEventListener("mouseenter", mouseEnterHandler);

    const mouseLeaveHandler = () => {
      shouldRespondWheel = false;
    };

    container.addEventListener("mouseleave", mouseLeaveHandler);

    globalEventTarget.addEventListener("wheel", onWheel as EventListener, {
      passive: false,
    });
    return () => {
      globalEventTarget.removeEventListener("wheel", onWheel as EventListener);
      container.removeEventListener("mouseenter", mouseEnterHandler);
      container.removeEventListener("mouseleave", mouseLeaveHandler);
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
    isCtrlKeyZoomEnable,
  ]);
};
