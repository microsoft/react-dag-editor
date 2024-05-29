import * as React from "react";
import { defaultColors } from "../common/constants";
import type { IEdgeConfig } from "../models/config/types";
import { GraphEdgeStatus } from "../models/status";
import * as Bitset from "../utils/bitset";
import { getCurvePathD } from "../utils/getCurvePathD";

export const line: IEdgeConfig = {
  render(args): React.ReactNode {
    const edge = args.model;
    const style = {
      cursor: "crosshair",
      stroke: Bitset.has(GraphEdgeStatus.Selected)(edge.status)
        ? defaultColors.edgeColorSelected
        : defaultColors.edgeColor,
      strokeWidth: "2",
    };

    return (
      <path
        key={edge.id}
        d={getCurvePathD(args.x2, args.x1, args.y2, args.y1)}
        fill="none"
        style={style}
        id={`edge${edge.id}`}
      />
    );
  },
};
