/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RefObject, useEffect } from "react";
import { GraphCanvasEvent } from "../models/event";
import { IContainerRect } from "../models/geometry";
import { BrowserType, getBrowser, getContainerCenter, isMobile } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { animationFramed } from "../utils/scheduling";

export interface GestureEvent extends UIEvent {
  scale: number;
}

const isSafari = getBrowser() === BrowserType.Safari;

let prevScale = 0;

export interface IUseSafariScaleParams {
  rectRef: RefObject<IContainerRect | undefined>;
  svgRef: RefObject<SVGSVGElement>;
  eventChannel: EventChannel;
}

export function useSafariScale({ rectRef, svgRef, eventChannel }: IUseSafariScaleParams): void {
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
      eventChannel.trigger({
        type: GraphCanvasEvent.Zoom,
        rawEvent: e,
        scale: delta,
        anchor: getContainerCenter(rectRef),
      });
    });
    const onGestureStart = (e: GestureEvent): void => {
      e.stopPropagation();
      e.preventDefault();
      prevScale = e.scale;

      eventChannel.trigger({
        type: GraphCanvasEvent.Zoom,
        rawEvent: e,
        scale: e.scale,
        anchor: getContainerCenter(rectRef),
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
    // @ts-ignore
    el.addEventListener("gesturestart", onGestureStart);
    // @ts-ignore
    el.addEventListener("gesturechange", onGestureChange);
    // @ts-ignore
    el.addEventListener("gestureend", onGestureEnd);
    return () => {
      // @ts-ignore
      el.removeEventListener("gesturestart", onGestureStart);
      // @ts-ignore
      el.removeEventListener("gesturechange", onGestureChange);
      // @ts-ignore
      el.removeEventListener("gestureend", onGestureEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
