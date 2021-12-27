import * as React from "react";
import { defaultColors } from "../../common/constants";
import {
  DragController,
  ITouchHandler,
  TouchController,
} from "../../controllers";
import { TouchDragAdapter } from "../../controllers/TouchDragAdapter";
import { EMPTY_TRANSFORM_MATRIX } from "../../createGraphState";
import { MouseMoveEventProvider } from "../../event-provider/MouseMoveEventProvider";
import {
  IEventProvider,
  IGlobalMoveEventTypes,
} from "../../event-provider/types";
import { useGraphData, useMinimapRect } from "../../hooks";
import {
  useGraphConfig,
  useGraphController,
  useViewport,
} from "../../hooks/context";
import { useRefValue } from "../../hooks/useRefValue";
import { GraphCanvasEvent, GraphMinimapEvent } from "../../models/event";
import { ITransformMatrix } from "../../models/geometry";
import {
  getPointDeltaByClientDelta,
  getVisibleArea,
  getZoomFitMatrix,
  isViewportComplete,
  reverseTransformPoint,
  transformPoint,
} from "../../utils";
import { clamp } from "../../utils/clamp";
import classes from "../Graph.styles.module.scss";
import { StaticGraph } from "../StaticGraph/StaticGraph";
import { IRect, MiniMapShadow } from "./Shadow";

export interface IMiniMapProps {
  /**
   * Custom styling for the minimap
   */
  style?: React.CSSProperties;
  /**
   * The padding of the minimap viewport
   *
   * @default 0
   */
  shadowPadding?: number;
  /**
   * The max nodes counts allowed to show in the minimap
   *
   * @default 150
   */
  maxNodesCountAllowed?: number;
  /**
   * The renderer when exceed the max node counts
   *
   * @default () => null
   */
  onRenderUnavailable?(): React.ReactNode;
  /**
   * The renderer to point the graph position when the graph is out of the viewport
   *
   * @param arrowDeg
   */
  renderArrow?(arrowDeg: number): React.ReactNode;
}

export const Minimap: React.FunctionComponent<IMiniMapProps> = (props) => {
  const {
    shadowPadding = 0,
    maxNodesCountAllowed = 150,
    onRenderUnavailable = () => null,
    renderArrow = (arrowDeg: number) => undefined,
  } = props;

  const graphViewport = useViewport();
  const graphController = useGraphController();
  const data = useGraphData();
  const minimapContainerStyle: React.CSSProperties = {
    background: defaultColors.minimapBackground,
    ...props.style,
  };

  const svgRef = React.useRef<SVGSVGElement>(null);
  const graphConfig = useGraphConfig();

  const rect = useMinimapRect(svgRef);
  const rectRef = useRefValue(rect);

  const minimapTransformMatrix = React.useMemo<ITransformMatrix>(() => {
    if (!rect) {
      return EMPTY_TRANSFORM_MATRIX;
    }
    return getZoomFitMatrix({
      data,
      rect,
      graphConfig,
      nodeMaxVisibleSize: {
        width: 0,
        height: 0,
      },
      nodeMinVisibleSize: {
        width: Infinity,
        height: Infinity,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect, data.nodes]);
  const minimapTransformMatrixRef = useRefValue(minimapTransformMatrix);

  const viewport = React.useMemo<IRect>(() => {
    if (!rect || !isViewportComplete(graphViewport)) {
      return {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
      };
    }

    const boundaryPoints = getVisibleArea(graphViewport);

    const { x: startX, y: startY } = transformPoint(
      boundaryPoints.minX,
      boundaryPoints.minY,
      minimapTransformMatrix
    );

    const { x: endX, y: endY } = transformPoint(
      boundaryPoints.maxX,
      boundaryPoints.maxY,
      minimapTransformMatrix
    );

    return {
      startX,
      startY,
      endX,
      endY,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rect,
    minimapTransformMatrix,
    graphViewport.rect,
    ...graphViewport.transformMatrix,
  ]);

  const onClick = React.useCallback(
    (evt: React.MouseEvent) => {
      evt.stopPropagation();
      if (!rect) {
        return;
      }
      const viewportWidth = viewport.endX - viewport.startX;
      const viewportHeight = viewport.endY - viewport.startY;
      const point = reverseTransformPoint(
        clamp(
          shadowPadding + viewportWidth / 2,
          rect.width - shadowPadding - viewportWidth / 2,
          evt.clientX - rect.left
        ),
        clamp(
          shadowPadding + viewportHeight / 2,
          rect.height - shadowPadding - viewportHeight / 2,
          evt.clientY - rect.top
        ),
        minimapTransformMatrix
      );

      graphController.eventChannel.batch([
        {
          type: GraphCanvasEvent.ScrollIntoView,
          x: point.x,
          y: point.y,
        },
        {
          type: GraphMinimapEvent.Click,
          rawEvent: evt,
        },
      ]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rect]
  );

  const onStartDrag = React.useCallback(
    (evt: MouseEvent, eventProvider: IEventProvider<IGlobalMoveEventTypes>) => {
      if (!rectRef.current) {
        return;
      }
      const { left, top, right, bottom } = rectRef.current;
      const validMouseRect = {
        startX: left + shadowPadding,
        startY: top + shadowPadding,
        endX: right - shadowPadding,
        endY: bottom - shadowPadding,
      };

      graphController.eventChannel.trigger({
        type: GraphMinimapEvent.PanStart,
        rawEvent: evt,
      });
      const drag = new DragController(eventProvider, (e) => {
        const x = clamp(validMouseRect.startX, validMouseRect.endX, e.clientX);
        const y = clamp(validMouseRect.startY, validMouseRect.endY, e.clientY);
        return {
          x,
          y,
        };
      });
      drag.onMove = ({ dx, dy, e }) => {
        const { x, y } = getPointDeltaByClientDelta(
          -dx,
          -dy,
          minimapTransformMatrixRef.current
        );
        graphController.eventChannel.trigger({
          type: GraphMinimapEvent.Pan,
          dx: x,
          dy: y,
          rawEvent: e,
        });
      };
      drag.start(evt);

      drag.onEnd = () => {
        graphController.eventChannel.trigger({
          type: GraphMinimapEvent.PanEnd,
          rawEvent: evt,
        });
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shadowPadding]
  );

  const arrowParams = React.useMemo(() => {
    if (!rect) {
      return {
        showArrow: false,
        arrowDeg: 0,
      };
    }

    const showArrow =
      viewport.startX > rect.width - shadowPadding ||
      viewport.startY > rect.height - shadowPadding ||
      viewport.endX < shadowPadding ||
      viewport.endY < shadowPadding;

    // arrow rotate center
    const x0 = rect.width / 2;
    const y0 = rect.height / 2;

    const x1 = (viewport.startX + viewport.endX) / 2;
    const y1 = (viewport.startY + viewport.endY) / 2;

    let arrowDeg = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
    if (arrowDeg < 0) {
      arrowDeg = arrowDeg + 360;
    }

    return {
      showArrow,
      arrowDeg,
    };
  }, [rect, viewport, shadowPadding]);

  const onMouseDown: React.MouseEventHandler = React.useCallback(
    (evt) => {
      onStartDrag(
        evt.nativeEvent,
        new MouseMoveEventProvider(graphController.getGlobalEventTarget())
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onStartDrag]
  );

  const touchController = React.useMemo(() => {
    const handlers = new Map<number, ITouchHandler>();
    const touchDragAdapter = new TouchDragAdapter();
    touchDragAdapter.on("start", (e) => {
      onStartDrag(e, touchDragAdapter);
    });
    handlers.set(1, touchDragAdapter);
    return new TouchController(handlers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStartDrag, rect]);

  const staticGraphEl = React.useMemo(
    () => <StaticGraph data={data} transformMatrix={minimapTransformMatrix} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.nodes, ...minimapTransformMatrix]
  );

  if (data.nodes.size > maxNodesCountAllowed) {
    return (
      <div className="minimap-container" style={minimapContainerStyle}>
        {onRenderUnavailable()}
      </div>
    );
  }

  return (
    <div
      className={`minimap-container ${classes.minimap}`}
      style={minimapContainerStyle}
    >
      {staticGraphEl}
      <svg
        className={classes.minimapSvg}
        {...touchController.eventHandlers}
        onMouseDown={onMouseDown}
        ref={svgRef}
        data-automation-id="minimap-id"
      >
        <MiniMapShadow
          containerRect={rect}
          viewport={viewport}
          shadowPadding={shadowPadding}
          onClick={onClick}
        />
      </svg>
      {arrowParams.showArrow && renderArrow(arrowParams.arrowDeg)}
    </div>
  );
};
