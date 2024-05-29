import * as React from "react";
import { Slots } from "../Slots/Slots";
import { defaultColors } from "../../common/constants";
import { INodeResizeHandlerProps } from "../../contexts/SlotsContext";

export const RESIZE_POINT_WIDTH = 8;
export const RESIZE_POINT_HEIGHT = 8;

export const NodeAnchor: React.FunctionComponent<INodeResizeHandlerProps> = ({ x, y, cursor, onMouseDown }) => {
  return (
    <Slots.NodeResizeHandler x={x} y={y} cursor={cursor} onMouseDown={onMouseDown}>
      <rect
        x={x}
        y={y}
        height={RESIZE_POINT_HEIGHT}
        width={RESIZE_POINT_WIDTH}
        stroke={defaultColors.controlPointColor}
        fill="transparent"
        cursor={cursor}
        onMouseDown={onMouseDown}
      />
    </Slots.NodeResizeHandler>
  );
};
