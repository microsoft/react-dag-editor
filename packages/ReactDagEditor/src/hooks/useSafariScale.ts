import { RefObject, useEffect } from "react";
import { IGraphConfig } from "../contexts";
import { IDispatch } from "../contexts/GraphStateContext";
import { GraphCanvasEvent } from "../models/event";
import { IContainerRect } from "../models/geometry";
import { IPropsAPI } from "../props-api/IPropsAPI";
import { BrowserType, getBrowser, getContainerCenter, isMobile } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { animationFramed } from "../utils/scheduling";
import { shouldZoomOut } from "./useWheelHandler";

export interface GestureEvent extends UIEvent {
  scale: number;
}

const isSafari = getBrowser() === BrowserType.safari;

let prevScale = 0;

export interface IUseSafariScaleParams {
  rectRef: RefObject<IContainerRect | undefined>;
  svgRef: RefObject<SVGSVGElement>;
  dispatch: IDispatch;
  eventChannel: EventChannel;
  graphConfig: IGraphConfig;
  propsAPI: IPropsAPI;
}

/**
 * @param root0
 * @param root0.svgRef
 * @param root0.dispatch
 * @param root0.canvasDidZoom
 * @param root0.graphConfig
 * @param root0.propsAPI
 */
export function useSafariScale({
  rectRef,
  svgRef,
  dispatch,
  eventChannel,
  graphConfig,
  propsAPI
}: IUseSafariScaleParams): void {
  useEffect(() => {
    const el = svgRef.current;
    if (!isSafari || !el || isMobile()) {
      return () => {
        // noop
      };
    }
    const onGestureEvent = animationFramed((e: GestureEvent): void => {
      const { scale } = e;
      const delta = scale / prevScale;
      prevScale = scale;
      if (scale >= 1 || shouldZoomOut(propsAPI, graphConfig)) {
        eventChannel.trigger({
          type: GraphCanvasEvent.Zoom,
          rawEvent: e,
          scale: delta,
          anchor: getContainerCenter(rectRef)
        });
      }
    });
    const onGestureStart = (e: GestureEvent): void => {
      e.stopPropagation();
      e.preventDefault();
      prevScale = e.scale;

      eventChannel.trigger({
        type: GraphCanvasEvent.Zoom,
        rawEvent: e,
        scale: e.scale,
        anchor: getContainerCenter(rectRef)
      });
    };
    const onGestureChange = (e: GestureEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onGestureEvent(e);
    };
    const onGestureEnd = (e: GestureEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onGestureEvent(e);
    };
    el.addEventListener("gesturestart", onGestureStart);
    el.addEventListener("gesturechange", onGestureChange);
    el.addEventListener("gestureend", onGestureEnd);
    return () => {
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
      el.removeEventListener("gestureend", onGestureEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
