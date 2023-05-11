import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { GraphCanvasEvent } from "../models/event";
import { IContainerRect } from "../models/geometry";
import { IGraphState } from "../models/state";
import { debounce } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { nextFrame } from "../utils/nextFrame";
import { noop } from "../utils/noop";

const LIMIT = 20;

const isRectChanged = (
  a: IContainerRect | undefined,
  b: IContainerRect | undefined
): boolean => {
  if (a === b) {
    return false;
  }
  if (!a || !b) {
    return true;
  }
  return (
    a.top !== b.top ||
    a.left !== b.left ||
    a.width !== b.width ||
    a.height !== b.height
  );
};

export const useUpdateViewportCallback = (
  rectRef: MutableRefObject<IContainerRect | undefined>,
  svgRef: RefObject<SVGSVGElement>,
  eventChannel: EventChannel
) =>
  useCallback(
    (force = false): void => {
      const viewportRect = svgRef.current?.getBoundingClientRect();
      if (force || isRectChanged(rectRef.current, viewportRect)) {
        rectRef.current = viewportRect;
        eventChannel.trigger({
          type: GraphCanvasEvent.ViewportResize,
          viewportRect,
        });
      }
    },
    [eventChannel, rectRef, svgRef]
  );

export const useContainerRect = (
  state: IGraphState,
  svgRef: RefObject<SVGSVGElement>,
  containerRef: RefObject<HTMLDivElement>,
  updateViewport: (force?: boolean) => void
): void => {
  useLayoutEffect(() => {
    if (!state.viewport.rect) {
      updateViewport(true);
    }
  }, [updateViewport, state.viewport.rect]);

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
    const listener = debounce((e: Event) => {
      const svg = svgRef.current;
      if (!svg || !(e.target instanceof Element) || !e.target.contains(svg)) {
        return;
      }
      updateViewport();
    }, LIMIT);
    const options: AddEventListenerOptions = {
      capture: true,
      passive: true,
    };
    document.body.addEventListener("scroll", listener, options);
    return () => {
      document.body.removeEventListener("scroll", listener, options);
    };
  }, [svgRef, updateViewport]);
};
