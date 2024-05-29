import * as React from "react";
import { defaultColors } from "../common/constants";
import type { INodeConfig, INodeDrawArgs } from "../models/config/types";
import type { ICanvasNode } from "../models/node";
import { GraphNodeStatus } from "../models/status";
import { has } from "../utils/bitset";
import { getRectHeight, getRectWidth } from "../utils/layout";
import { RectComponent } from "./RectComponent";

export const rect: INodeConfig = {
  getMinHeight(): number {
    return 150;
  },
  getMinWidth(): number {
    return 150;
  },
  render(args: INodeDrawArgs): React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = args.model as ICanvasNode<any, any>;
    const width = getRectWidth(rect, node);
    const height = getRectHeight(rect, node);
    const style = has(GraphNodeStatus.Selected | GraphNodeStatus.Activated)(node.status)
      ? {
          fill: defaultColors.nodeActivateFill,
          stroke: defaultColors.nodeActivateStroke,
        }
      : {
          fill: defaultColors.nodeFill,
          fillOpacity: 0.1,
          stroke: defaultColors.nodeStroke,
          borderRadius: "5",
        };
    const textY = node.y + height / 3;

    return <RectComponent style={style} node={node} width={width} height={height} textY={textY} />;
  },
};
