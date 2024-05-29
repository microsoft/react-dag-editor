import * as React from "react";
import { createUseStyles } from "react-jss";
import { defaultColors } from "../common/constants";
import { IDispatch } from "../contexts/GraphStateContext";
import { defaultGetPositionFromEvent, DragController } from "../controllers/DragController";
import { MouseMoveEventProvider } from "../event-provider/MouseMoveEventProvider";
import { useGraphController } from "../hooks/context";
import { useRefValue } from "../hooks/useRefValue";
import { GraphScrollBarEvent } from "../models/event";
import { IViewport } from "../models/geometry";
import { EventChannel } from "../utils/eventChannel";
import { IOffsetLimit } from "../utils/getOffsetLimit";

const SCROLL_BAR_WIDTH = 10;

interface IScrollbarLayout {
  verticalScrollTop: number;
  verticalScrollHeight: number;
  horizontalScrollLeft: number;
  horizontalScrollWidth: number;
  totalContentHeight: number;
  totalContentWidth: number;
}

interface IProps {
  viewport: Required<IViewport>;
  horizontal?: boolean;
  vertical?: boolean;
  offsetLimit: IOffsetLimit;
  eventChannel: EventChannel;
  dispatch: IDispatch;
}

const wrapperCommonStyle: React.CSSProperties = {
  position: "absolute",
  cursor: "initial",
};

const useStyles = createUseStyles({
  verticalScrollWrapper: {
    ...wrapperCommonStyle,
    height: "100%",
    width: SCROLL_BAR_WIDTH,
    top: 0,
    right: 0,
  },
  horizontalScrollWrapper: {
    ...wrapperCommonStyle,
    height: SCROLL_BAR_WIDTH,
    width: "100%",
    bottom: 0,
    left: 0,
  },
  verticalScrollStyle: (args: { scrollbarLayout: IScrollbarLayout }) => ({
    height: args.scrollbarLayout.verticalScrollHeight,
    width: "100%",
    backgroundColor: defaultColors.scrollbarColor,
    position: "absolute",
    top: 0,
    right: 0,
    transform: `translateY(${args.scrollbarLayout.verticalScrollTop}px)`,
  }),
  horizontalScrollStyle: (args: { scrollbarLayout: IScrollbarLayout }) => ({
    width: args.scrollbarLayout.horizontalScrollWidth - SCROLL_BAR_WIDTH,
    height: "100%",
    backgroundColor: defaultColors.scrollbarColor,
    position: "absolute",
    left: 0,
    bottom: 0,
    transform: `translateX(${args.scrollbarLayout.horizontalScrollLeft}px)`,
  }),
});

export const Scrollbar: React.FC<IProps> = props => {
  const { vertical = true, horizontal = true, offsetLimit, eventChannel, viewport } = props;

  const graphController = useGraphController();

  const scrollbarLayout = getScrollbarLayout(viewport, offsetLimit);

  const classes = useStyles({ scrollbarLayout });

  const scrollbarLayoutRef = useRefValue(scrollbarLayout);

  /**
   * @param e
   */
  function onVerticalScrollMouseDown(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const { height: containerHeight } = viewport.rect;

    const dragging = new DragController(
      new MouseMoveEventProvider(graphController.getGlobalEventTarget()),
      defaultGetPositionFromEvent,
    );
    dragging.onMove = ({ dy: scrollbarDy, e: rawEvent }) => {
      const { totalContentHeight } = scrollbarLayoutRef.current;
      const dy = -(scrollbarDy * totalContentHeight) / containerHeight;
      eventChannel.trigger({
        type: GraphScrollBarEvent.Scroll,
        rawEvent,
        dx: 0,
        dy,
      });
    };
    dragging.onEnd = () => {
      eventChannel.trigger({
        type: GraphScrollBarEvent.ScrollEnd,
      });
    };
    dragging.start(e.nativeEvent);

    eventChannel.trigger({
      type: GraphScrollBarEvent.ScrollStart,
    });
  }

  /**
   * @param e
   */
  function onHorizontalScrollMouseDown(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const { width: containerWidth } = viewport.rect;

    const dragging = new DragController(
      new MouseMoveEventProvider(graphController.getGlobalEventTarget()),
      defaultGetPositionFromEvent,
    );
    dragging.onMove = ({ dx: scrollbarDx, e: rawEvent }) => {
      const { totalContentWidth } = scrollbarLayoutRef.current;
      const dx = -(scrollbarDx * totalContentWidth) / containerWidth;
      eventChannel.trigger({
        type: GraphScrollBarEvent.Scroll,
        rawEvent,
        dx,
        dy: 0,
      });
    };
    dragging.onEnd = () => {
      eventChannel.trigger({
        type: GraphScrollBarEvent.ScrollEnd,
      });
    };

    dragging.start(e.nativeEvent);

    eventChannel.trigger({
      type: GraphScrollBarEvent.ScrollStart,
    });
  }

  return (
    <>
      {vertical && (
        <div className={classes.verticalScrollWrapper}>
          <div
            className={classes.verticalScrollStyle}
            onMouseDown={onVerticalScrollMouseDown}
            role="button"
            aria-label="vertical scrollbar"
            aria-roledescription="vertical scrollbar"
            id="canvas-vertical-scrollbar"
          />
        </div>
      )}
      {horizontal && (
        <div className={classes.horizontalScrollWrapper}>
          <div
            className={classes.horizontalScrollStyle}
            onMouseDown={onHorizontalScrollMouseDown}
            role="button"
            aria-label="horizontal scrollbar"
            aria-roledescription="horizontal scrollbar"
            id="canvas-horizontal-scrollbar"
          />
        </div>
      )}
    </>
  );
};

// =========================== utils for scroll bar ================================

/**
 * get the total content height, including the container height and the scrollable area
 *
 * @param containerHeight
 * @param offsetLimit
 * @returns totalContentHeight
 */
function getTotalContentHeight(containerHeight: number, offsetLimit: IOffsetLimit): number {
  const { minY, maxY } = offsetLimit;
  return containerHeight + maxY - minY;
}

/**
 * get the total content width, including the container width and the scrollable area
 *
 * @param containerWidth
 * @param offsetLimit
 * @returns totalContentWidth
 */
function getTotalContentWidth(containerWidth: number, offsetLimit: IOffsetLimit): number {
  const { minX, maxX } = offsetLimit;
  return containerWidth + maxX - minX;
}

/**
 * get the scrollbar size and position
 *
 * @param rect
 * @param offsetLimit
 * @param zoomPanSettings
 * @returns
 */
function getScrollbarLayout(viewport: Required<IViewport>, offsetLimit: IOffsetLimit): IScrollbarLayout {
  const { rect, transformMatrix } = viewport;
  const totalContentHeight = getTotalContentHeight(rect.height, offsetLimit);
  const totalContentWidth = getTotalContentWidth(rect.width, offsetLimit);

  return {
    totalContentHeight,
    totalContentWidth,
    verticalScrollHeight: (rect.height * rect.height) / totalContentHeight,
    horizontalScrollWidth: (rect.width * rect.width) / totalContentWidth,
    verticalScrollTop: ((offsetLimit.maxY - transformMatrix[5]) * rect.height) / totalContentHeight,
    horizontalScrollLeft: ((offsetLimit.maxX - transformMatrix[4]) * rect.width) / totalContentWidth,
  };
}
