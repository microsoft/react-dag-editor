import * as React from "react";
import { createUseStyles } from "react-jss";
import { GraphConfigContext, IGraphConfig } from "../contexts/GraphConfigContext";
import { IDispatch } from "../contexts/GraphStateContext";
import { ITheme } from "../contexts/ThemeContext";
import { defaultGetPositionFromEvent, DragController } from "../controllers/DragController";
import { MouseMoveEventProvider } from "../event-provider/MouseMoveEventProvider";
import { useRefValue } from "../hooks/useRefValue";
import { useTheme } from "../hooks/useTheme";
import { GraphScrollBarEvent } from "../models/event";
import { IGap, IViewport } from "../models/geometry";
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
  canvasBoundaryPadding: IGap | undefined;
  offsetLimit: IOffsetLimit;
  eventChannel: EventChannel;
  dispatch: IDispatch;
}

const wrapperCommonStyle: React.CSSProperties = {
  position: "absolute",
  cursor: "initial"
};

const useStyles = createUseStyles({
  verticalScrollWrapper: {
    ...wrapperCommonStyle,
    height: "100%",
    width: SCROLL_BAR_WIDTH,
    top: 0,
    right: 0
  },
  horizontalScrollWrapper: {
    ...wrapperCommonStyle,
    height: SCROLL_BAR_WIDTH,
    width: "100%",
    bottom: 0,
    left: 0
  },
  verticalScrollStyle: (args: { scrollbarLayout: IScrollbarLayout; theme: ITheme }) => ({
    height: args.scrollbarLayout.verticalScrollHeight,
    width: "100%",
    backgroundColor: args.theme.scrollbarColor,
    position: "absolute",
    top: 0,
    right: 0,
    transform: `translateY(${args.scrollbarLayout.verticalScrollTop}px)`
  }),
  horizontalScrollStyle: (args: { scrollbarLayout: IScrollbarLayout; theme: ITheme }) => ({
    width: args.scrollbarLayout.horizontalScrollWidth - SCROLL_BAR_WIDTH,
    height: "100%",
    backgroundColor: args.theme.scrollbarColor,
    position: "absolute",
    left: 0,
    bottom: 0,
    transform: `translateX(${args.scrollbarLayout.horizontalScrollLeft}px)`
  })
});

export const Scrollbar: React.FC<IProps> = props => {
  const { vertical = true, horizontal = true, offsetLimit, eventChannel, viewport, canvasBoundaryPadding } = props;

  const graphConfig = React.useContext<IGraphConfig>(GraphConfigContext);
  const { theme } = useTheme();

  const scrollbarLayout = getScrollbarLayout(viewport, offsetLimit);

  const classes = useStyles({ scrollbarLayout, theme });

  const scrollbarLayoutRef = useRefValue(scrollbarLayout);

  /**
   * @param e
   */
  function onVerticalScrollMouseDown(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const { height: containerHeight } = viewport.visibleRect;

    const dragging = new DragController(
      new MouseMoveEventProvider(graphConfig.getGlobalEventTarget()),
      defaultGetPositionFromEvent
    );
    dragging.onMove = ({ dy: scrollbarDy, e: rawEvent }) => {
      const { totalContentHeight } = scrollbarLayoutRef.current;
      const dy = -(scrollbarDy * totalContentHeight) / containerHeight;
      eventChannel.trigger({
        type: GraphScrollBarEvent.Scroll,
        rawEvent,
        dx: 0,
        dy,
        limitBoundary: true
      });

      if (scrollbarDy < 0) {
        eventChannel.trigger({
          type: GraphScrollBarEvent.ScrollTop
        });
      } else if (scrollbarDy > 0) {
        eventChannel.trigger({
          type: GraphScrollBarEvent.ScrollBottom
        });
      }
    };
    dragging.onEnd = () => {
      eventChannel.trigger({
        type: GraphScrollBarEvent.ScrollEnd
      });
    };
    dragging.start(e.nativeEvent);

    eventChannel.trigger({
      type: GraphScrollBarEvent.ScrollStart
    });
  }

  /**
   * @param e
   */
  function onHorizontalScrollMouseDown(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const { width: containerWidth } = viewport.visibleRect;

    const dragging = new DragController(
      new MouseMoveEventProvider(graphConfig.getGlobalEventTarget()),
      defaultGetPositionFromEvent
    );
    dragging.onMove = ({ dx: scrollbarDx, e: rawEvent }) => {
      const { totalContentWidth } = scrollbarLayoutRef.current;
      const dx = -(scrollbarDx * totalContentWidth) / containerWidth;
      eventChannel.trigger({
        type: GraphScrollBarEvent.Scroll,
        rawEvent,
        dx,
        dy: 0,
        limitBoundary: true,
        canvasBoundaryPadding
      });

      if (scrollbarDx < 0) {
        eventChannel.trigger({
          type: GraphScrollBarEvent.ScrollLeft
        });
      } else if (scrollbarDx > 0) {
        eventChannel.trigger({
          type: GraphScrollBarEvent.ScrollRight
        });
      }
    };
    dragging.onEnd = () => {
      eventChannel.trigger({
        type: GraphScrollBarEvent.ScrollEnd
      });
    };

    dragging.start(e.nativeEvent);

    eventChannel.trigger({
      type: GraphScrollBarEvent.ScrollStart
    });
  }

  return (
    <>
      {vertical && scrollbarLayout.verticalScrollHeight < viewport.visibleRect.height && (
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
      {horizontal && scrollbarLayout.horizontalScrollWidth < viewport.visibleRect.width && (
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
  const { visibleRect, transformMatrix } = viewport;
  const totalContentHeight = getTotalContentHeight(visibleRect.height, offsetLimit);
  const totalContentWidth = getTotalContentWidth(visibleRect.width, offsetLimit);

  return {
    totalContentHeight,
    totalContentWidth,
    verticalScrollHeight: (visibleRect.height * visibleRect.height) / totalContentHeight,
    horizontalScrollWidth: (visibleRect.width * visibleRect.width) / totalContentWidth,
    verticalScrollTop: ((offsetLimit.maxY - transformMatrix[5]) * visibleRect.height) / totalContentHeight,
    horizontalScrollLeft: ((offsetLimit.maxX - transformMatrix[4]) * visibleRect.width) / totalContentWidth
  };
}
