import * as React from "react";
import { IEdgeConfig, ITheme } from "../contexts";
import { GraphEdgeState, ICanvasEdge } from "../Graph.interface";
import { getCurvePathD, hasState } from "../utils";

export const line: IEdgeConfig = {
  getStyle(edge: ICanvasEdge, theme: ITheme): React.CSSProperties {
    return {
      cursor: "crosshair",
      stroke: hasState(GraphEdgeState.selected)(edge.state)
        ? theme.edgeColorSelected
        : theme.edgeColor,
      strokeWidth: "2"
    };
  },
  render(args): React.ReactNode {
    const edge = args.model;
    const style = line.getStyle ? line.getStyle(edge, args.theme) : {};

    return (
      <path
        key={edge.id}
        d={getCurvePathD(args.x2, args.x1, args.y2, args.y1)}
        fill="none"
        style={style}
        id={`edge${edge.id}`}
      />
    );
  }
};
