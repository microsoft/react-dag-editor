import * as React from "react";
import { INodeDrawArgs, IRectConfig, ITheme } from "../contexts";
import { GraphNodeState, ICanvasNode } from "../Graph.interface";
import { hasState } from "../utils";
import { getRectHeight, getRectWidth } from "../utils/layout";
import { RectComponent } from "./RectComponent";

export const rect: IRectConfig<ICanvasNode> = {
  getMinHeight(): number {
    return 150;
  },
  getMinWidth(): number {
    return 150;
  },
  getStyle(node: ICanvasNode, theme: ITheme): Partial<React.CSSProperties> {
    if (
      hasState(GraphNodeState.selected | GraphNodeState.activated)(node.state)
    ) {
      return {
        fill: theme.nodeActivateFill,
        stroke: theme.nodeActivateStroke
      };
    }

    return {
      fill: theme.nodeFill,
      fillOpacity: 0.1,
      stroke: theme.nodeStroke,
      borderRadius: "5"
    };
  },
  render(args: INodeDrawArgs): React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = args.model as ICanvasNode<any, any>;
    const width = getRectWidth<ICanvasNode>(rect, node);
    const height = getRectHeight<ICanvasNode>(rect, node);
    const style = rect.getStyle ? rect.getStyle(node, args.theme) : {};
    const textY = node.y + height / 3;

    return (
      <RectComponent
        style={style}
        node={node}
        width={width}
        height={height}
        textY={textY}
      />
    );
  }
};
