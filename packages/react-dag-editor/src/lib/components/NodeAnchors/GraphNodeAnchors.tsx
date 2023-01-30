import * as React from "react";
import {
  IGraphNodeAnchorsProps,
  NodeAnchor,
  RESIZE_POINT_WIDTH,
  RESIZE_POINT_HEIGHT,
} from ".";
import { useGraphConfig, useGetMouseDownOnAnchor } from "../../hooks";
import { getNodeConfig, getRectHeight, getRectWidth } from "../../utils";

const BBOX_PADDING = 15;

export const GraphNodeAnchors: React.FunctionComponent<
  IGraphNodeAnchorsProps
> = (props) => {
  const { node, eventChannel } = props;

  const graphConfig = useGraphConfig();
  const nodeConfig = getNodeConfig(node, graphConfig);

  const minWidth = nodeConfig?.getMinWidth(node) ?? 0;
  const minHeight = nodeConfig?.getMinHeight(node) ?? 0;

  const height = getRectHeight(nodeConfig, node);
  const width = getRectWidth(nodeConfig, node);

  const getMouseDown = useGetMouseDownOnAnchor(node, eventChannel);

  const nw = getMouseDown((dx, dy) => {
    const finalDx = Math.min(dx, width - minWidth);
    const finalDy = Math.min(dy, height - minHeight);
    return {
      dx: +finalDx,
      dy: +finalDy,
      dWidth: -finalDx,
      dHeight: -finalDy,
    };
  });

  const n = getMouseDown((dx, dy) => {
    const finalDy = Math.min(dy, height - minHeight);
    return {
      dy: +finalDy,
      dHeight: -finalDy,
    };
  });

  const ne = getMouseDown((dx, dy) => {
    const finalDx = Math.max(dx, minWidth - width);
    const finalDy = Math.min(dy, height - minHeight);
    return {
      dy: +finalDy,
      dWidth: +finalDx,
      dHeight: -finalDy,
    };
  });

  const e = getMouseDown((dx) => {
    const finalDx = Math.max(dx, minWidth - width);
    return {
      dWidth: +finalDx,
    };
  });

  const se = getMouseDown((dx, dy) => {
    const finalDx = Math.max(dx, minWidth - width);
    const finalDy = Math.max(dy, minHeight - height);
    return {
      dWidth: +finalDx,
      dHeight: +finalDy,
    };
  });

  const s = getMouseDown((dx, dy) => {
    const finalDy = Math.max(dy, minHeight - height);
    return {
      dHeight: +finalDy,
    };
  });

  const sw = getMouseDown((dx, dy) => {
    const finalDx = Math.min(dx, width - minWidth);
    const finalDy = Math.max(dy, minHeight - height);
    return {
      dx: +finalDx,
      dWidth: -finalDx,
      dHeight: +finalDy,
    };
  });

  const w = getMouseDown((dx) => {
    const finalDx = Math.min(dx, width - minWidth);
    return {
      dx: finalDx,
      dWidth: -finalDx,
    };
  });

  return (
    <>
      <NodeAnchor
        key="nw-resize"
        cursor="nw-resize"
        x={node.x - BBOX_PADDING}
        y={node.y - BBOX_PADDING - RESIZE_POINT_HEIGHT}
        onMouseDown={nw}
      />
      <NodeAnchor
        key="n-resize"
        x={node.x + width / 2 - RESIZE_POINT_WIDTH / 2}
        y={node.y - BBOX_PADDING - RESIZE_POINT_HEIGHT}
        cursor="n-resize"
        onMouseDown={n}
      />
      <NodeAnchor
        key="ne-resize"
        x={node.x + width + BBOX_PADDING - RESIZE_POINT_WIDTH}
        y={node.y - BBOX_PADDING - RESIZE_POINT_HEIGHT}
        cursor="ne-resize"
        onMouseDown={ne}
      />
      <NodeAnchor
        key="e-resize"
        x={node.x + width + BBOX_PADDING - RESIZE_POINT_WIDTH}
        y={node.y + height / 2 - RESIZE_POINT_HEIGHT / 2}
        cursor="e-resize"
        onMouseDown={e}
      />
      <NodeAnchor
        key="se-resize"
        x={node.x + width + BBOX_PADDING - RESIZE_POINT_WIDTH}
        y={node.y + height + BBOX_PADDING}
        cursor="se-resize"
        onMouseDown={se}
      />
      <NodeAnchor
        key="s-resize"
        x={node.x + width / 2 - RESIZE_POINT_WIDTH / 2}
        y={node.y + height + BBOX_PADDING}
        cursor="s-resize"
        onMouseDown={s}
      />
      <NodeAnchor
        key="sw-resize"
        x={node.x - BBOX_PADDING}
        y={node.y + height + BBOX_PADDING}
        cursor="sw-resize"
        onMouseDown={sw}
      />
      <NodeAnchor
        key="w-resize"
        x={node.x - BBOX_PADDING}
        y={node.y + height / 2 - RESIZE_POINT_HEIGHT / 2}
        cursor="w-resize"
        onMouseDown={w}
      />
    </>
  );
};
