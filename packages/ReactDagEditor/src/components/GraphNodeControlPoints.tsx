import * as React from "react";
import { GraphConfigContext, IGraphConfig, ITheme } from "../contexts";
import { GraphControllerContext } from "../contexts/GraphControllerContext";
import { defaultGetPositionFromEvent, DragController } from "../controllers";
import { MouseMoveEventProvider } from "../event-provider/MouseMoveEventProvider";
import { useTheme } from "../hooks";
import { GraphNodeEvent } from "../models/event";
import { INodeGeometryDelta } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
import { getNodeConfig, getRectHeight, getRectWidth } from "../utils";
import { EventChannel } from "../utils/eventChannel";

interface IGraphNodeControlPointsProps {
  node: NodeModel;
  eventChannel: EventChannel;
}

const BBOX_PADDING = 15;

type Handler = (dx: number, dy: number) => Partial<INodeGeometryDelta>;

interface IResizePointProps {
  cursor: string;
  x: number;
  y: number;
  theme: ITheme;
  onMouseDown: React.MouseEventHandler;
}

const ResizePoint: React.FunctionComponent<IResizePointProps> = ({ x, y, cursor, theme, onMouseDown }) => {
  return (
    <rect
      x={x}
      y={y}
      height={8}
      width={8}
      stroke={theme.controlPointColor}
      fill="transparent"
      cursor={cursor}
      onMouseDown={onMouseDown}
    />
  );
};

export const GraphNodeControlPoints: React.FunctionComponent<IGraphNodeControlPointsProps> = props => {
  const { node, eventChannel } = props;

  const graphConfig = React.useContext<IGraphConfig>(GraphConfigContext);
  const nodeConfig = getNodeConfig(node, graphConfig);
  const graphController = React.useContext(GraphControllerContext);

  const minWidth = nodeConfig.getMinWidth(node);
  const minHeight = nodeConfig.getMinHeight(node);

  const { theme } = useTheme();

  const height = getRectHeight(nodeConfig, node);
  const width = getRectWidth(nodeConfig, node);

  const getMouseDown = (f: Handler) => (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    eventChannel.trigger({
      type: GraphNodeEvent.ResizingStart,
      rawEvent: evt,
      node
    });

    const drag = new DragController(
      new MouseMoveEventProvider(graphController.getGlobalEventTarget()),
      defaultGetPositionFromEvent
    );
    drag.onMove = ({ totalDX, totalDY, e: rawEvent }) => {
      eventChannel.trigger({
        type: GraphNodeEvent.Resizing,
        rawEvent,
        node,
        dx: 0,
        dy: 0,
        dWidth: 0,
        dHeight: 0,
        ...f(totalDX, totalDY)
      });
    };
    drag.onEnd = ({ e: rawEvent }) => {
      eventChannel.trigger({
        type: GraphNodeEvent.ResizingEnd,
        rawEvent,
        node
      });
    };
    eventChannel.trigger({
      type: GraphNodeEvent.ResizingStart,
      rawEvent: evt,
      node
    });
    drag.start(evt.nativeEvent);
  };

  const nw = getMouseDown((dx, dy) => {
    const finalDx = Math.min(dx, width - minWidth);
    const finalDy = Math.min(dy, height - minHeight);
    return {
      dx: +finalDx,
      dy: +finalDy,
      dWidth: -finalDx,
      dHeight: -finalDy
    };
  });

  const n = getMouseDown((dx, dy) => {
    const finalDy = Math.min(dy, height - minHeight);
    return {
      dy: +finalDy,
      dHeight: -finalDy
    };
  });

  const ne = getMouseDown((dx, dy) => {
    const finalDx = Math.max(dx, minWidth - width);
    const finalDy = Math.min(dy, height - minHeight);
    return {
      dy: +finalDy,
      dWidth: +finalDx,
      dHeight: -finalDy
    };
  });

  const e = getMouseDown(dx => {
    const finalDx = Math.max(dx, minWidth - width);
    return {
      dWidth: +finalDx
    };
  });

  const se = getMouseDown((dx, dy) => {
    const finalDx = Math.max(dx, minWidth - width);
    const finalDy = Math.max(dy, minHeight - height);
    return {
      dWidth: +finalDx,
      dHeight: +finalDy
    };
  });

  const s = getMouseDown((dx, dy) => {
    const finalDy = Math.max(dy, minHeight - height);
    return {
      dHeight: +finalDy
    };
  });

  const sw = getMouseDown((dx, dy) => {
    const finalDx = Math.min(dx, width - minWidth);
    const finalDy = Math.max(dy, minHeight - height);
    return {
      dx: +finalDx,
      dWidth: -finalDx,
      dHeight: +finalDy
    };
  });

  const w = getMouseDown(dx => {
    const finalDx = Math.min(dx, width - minWidth);
    return {
      dx: finalDx,
      dWidth: -finalDx
    };
  });

  return (
    <>
      <ResizePoint
        theme={theme}
        cursor="nw-resize"
        x={node.x - BBOX_PADDING}
        y={node.y - BBOX_PADDING}
        onMouseDown={nw}
      />
      <ResizePoint theme={theme} x={node.x + width / 2} y={node.y - BBOX_PADDING} cursor="n-resize" onMouseDown={n} />
      <ResizePoint
        theme={theme}
        x={node.x + width + BBOX_PADDING}
        y={node.y - BBOX_PADDING}
        cursor="ne-resize"
        onMouseDown={ne}
      />
      <ResizePoint
        theme={theme}
        x={node.x + width + BBOX_PADDING}
        y={node.y + height / 2}
        cursor="e-resize"
        onMouseDown={e}
      />
      <ResizePoint
        theme={theme}
        x={node.x + width + BBOX_PADDING}
        y={node.y + height + BBOX_PADDING}
        cursor="se-resize"
        onMouseDown={se}
      />
      <ResizePoint
        theme={theme}
        x={node.x + width / 2}
        y={node.y + height + BBOX_PADDING}
        cursor="s-resize"
        onMouseDown={s}
      />
      <ResizePoint
        theme={theme}
        x={node.x - BBOX_PADDING}
        y={node.y + height + BBOX_PADDING}
        cursor="sw-resize"
        onMouseDown={sw}
      />
      <ResizePoint theme={theme} x={node.x - BBOX_PADDING} y={node.y + height / 2} cursor="w-resize" onMouseDown={w} />
    </>
  );
  // tslint:enable:use-simple-attributes
};
