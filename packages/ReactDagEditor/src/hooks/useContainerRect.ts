import { MutableRefObject, RefObject, useCallback, useEffect, useLayoutEffect } from "react";
import { GraphCanvasEvent } from "../models/event";
import { IContainerRect } from "../models/geometry";
import { debounce } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { nextFrame } from "../utils/nextFrame";
import { noop } from "../utils/noop";

const LIMIT = 20;

/**
 * @deprecated use IContainerRect instead
 */
export type TContainerRect = IContainerRect;

const isRectChanged = (a: IContainerRect | undefined, b: IContainerRect | undefined): boolean => {
  if (!a || !b) {
    return true;
  }
  if (a === b) {
    return false;
  }
  return a.top !== b.top || a.left !== b.left || a.width !== b.width || a.height !== b.height;
};

export const useUpdateViewportCallback = (
  rectRef: MutableRefObject<IContainerRect | undefined>,
  visibleRectRef: MutableRefObject<IContainerRect | undefined>,
  svgRef: RefObject<SVGSVGElement>,
  containerRef: RefObject<HTMLDivElement>,
  eventChannel: EventChannel
) =>
  useCallback((): void => {
    const viewportRect = svgRef.current?.getBoundingClientRect();
    const visibleRect = containerRef.current?.getBoundingClientRect();
    if (isRectChanged(rectRef.current, viewportRect) || isRectChanged(visibleRectRef.current, visibleRect)) {
      rectRef.current = viewportRect;
      visibleRectRef.current = visibleRect;
      eventChannel.trigger({
        type: GraphCanvasEvent.ViewportResize,
        viewportRect,
        visibleRect
      });
    }
  }, [containerRef, eventChannel, rectRef, svgRef, visibleRectRef]);

export const useContainerRect = (
  svgRef: RefObject<SVGSVGElement>,
  containerRef: RefObject<HTMLDivElement>,
  updateViewport: () => void
): void => {
  useLayoutEffect(updateViewport, [updateViewport]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return noop;
    }

    const onResize = debounce(
      () =>
        /**
         * > This error means that ResizeObserver was not able
         * > to deliver all observations within a single animation frame.
         * > It is benign (your site will not break). – Aleksandar Totic Apr 15 at 3:14
         * https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
         */
        nextFrame(() => {
          updateViewport();
        }),
      LIMIT
    );

    // eslint-disable-next-line @typescript-eslint/tslint/config
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);
      return () => {
        resizeObserver.unobserve(container);
        resizeObserver.disconnect();
      };
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [containerRef, updateViewport]);

  useEffect(() => {
    const listener = debounce((e: UIEvent) => {
      const svg = svgRef.current;
      if (!svg || !(e.target instanceof Element) || !e.target.contains(svg)) {
        return;
      }
      updateViewport();
    }, LIMIT);
    const options: AddEventListenerOptions = {
      capture: true,
      passive: true
    };
    document.body.addEventListener("scroll", listener, options);
    return () => {
      document.body.removeEventListener("scroll", listener, options);
    };
  }, [svgRef, updateViewport]);
};
