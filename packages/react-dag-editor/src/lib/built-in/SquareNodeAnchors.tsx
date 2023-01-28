import * as React from "react";
import {
  IGraphNodeAnchorsProps,
  NodeAnchor,
  RESIZE_POINT_WIDTH,
  RESIZE_POINT_HEIGHT,
} from "../components/NodeAnchors";
import { useGraphConfig, useGetMouseDownOnAnchor } from "../hooks";
import { getNodeConfig, getRectHeight, getRectWidth } from "../utils";

const DEFAULT_Min_SIZE = 0;
const DEFAULT_MAX_SIZE = 300;

export const SquareNodeAnchors: React.FunctionComponent<
  IGraphNodeAnchorsProps
> = (props) => {
  const { node, eventChannel } = props;

  const graphConfig = useGraphConfig();
  const nodeConfig = getNodeConfig(node, graphConfig);

  const minWidth = nodeConfig?.getMinWidth(node) ?? DEFAULT_Min_SIZE;
  const minHeight = nodeConfig?.getMinHeight(node) ?? DEFAULT_Min_SIZE;
  const maxWidth = nodeConfig?.getMaxWidth
    ? nodeConfig.getMaxWidth(node)
    : DEFAULT_MAX_SIZE;
  const maxHeight = nodeConfig?.getMaxHeight
    ? nodeConfig.getMaxHeight(node)
    : DEFAULT_MAX_SIZE;

  const height = getRectHeight(nodeConfig, node);
  const width = getRectWidth(nodeConfig, node);

  const getMouseDown = useGetMouseDownOnAnchor(node, eventChannel);

  const nw = getMouseDown((dx, dy) => {
    const finalDx =
      dx > 0 ? Math.min(dx, width - minWidth) : Math.max(dx, width - maxWidth);
    const finalDy =
      dy > 0
        ? Math.min(dy, height - minHeight)
        : Math.max(dy, height - maxHeight);
    return {
      dx: +finalDx,
      dy: +finalDy,
      dWidth: -finalDx,
      dHeight: -finalDy,
    };
  });

  const ne = getMouseDown((dx, dy) => {
    const finalDx =
      dx > 0 ? Math.min(dx, maxWidth - width) : Math.max(dx, minWidth - width);
    const finalDy =
      dy > 0
        ? Math.min(dy, height - minHeight)
        : Math.max(dy, height - maxHeight);
    return {
      dy: +finalDy,
      dWidth: +finalDx,
      dHeight: -finalDy,
    };
  });

  const se = getMouseDown((dx, dy) => {
    const finalDx =
      dx > 0 ? Math.min(dx, maxWidth - width) : Math.max(dx, minWidth - width);
    const finalDy =
      dy > 0
        ? Math.min(dy, maxHeight - height)
        : Math.max(dy, minHeight - height);
    return {
      dWidth: +finalDx,
      dHeight: +finalDy,
    };
  });

  const sw = getMouseDown((dx, dy) => {
    const finalDx =
      dx > 0 ? Math.min(dx, width - minWidth) : Math.max(dx, width - maxWidth);
    const finalDy =
      dy > 0
        ? Math.min(dy, maxHeight - height)
        : Math.max(dy, minHeight - height);
    return {
      dx: +finalDx,
      dWidth: -finalDx,
      dHeight: +finalDy,
    };
  });

  return (
    <>
      <NodeAnchor
        cursor="nw-resize"
        x={node.x - RESIZE_POINT_WIDTH}
        y={node.y - RESIZE_POINT_HEIGHT}
        onMouseDown={nw}
      />
      <NodeAnchor
        x={node.x + width}
        y={node.y - RESIZE_POINT_HEIGHT}
        cursor="ne-resize"
        onMouseDown={ne}
      />
      <NodeAnchor
        x={node.x + width}
        y={node.y + height}
        cursor="se-resize"
        onMouseDown={se}
      />
      <NodeAnchor
        x={node.x - RESIZE_POINT_WIDTH}
        y={node.y + height}
        cursor="sw-resize"
        onMouseDown={sw}
      />
    </>
  );
};
