import * as React from "react";
import { defaultColors } from "../../common/constants";

export interface ISelectBoxPosition {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export const emptySelectBoxPosition = (): ISelectBoxPosition => ({
  startX: 0,
  startY: 0,
  height: 0,
  width: 0,
});

interface IProps {
  selectBoxPosition: ISelectBoxPosition;
  style?: React.CSSProperties;
}

export const SelectBox: React.FC<IProps> = props => {
  const { selectBoxPosition, style } = props;

  const selectBoxD = `m${selectBoxPosition.startX} ${selectBoxPosition.startY} v ${selectBoxPosition.height} h ${
    selectBoxPosition.width
  } v${-selectBoxPosition.height} h ${-selectBoxPosition.width}`;

  const pathStyle = style ?? {
    fill: "none",
    stroke: defaultColors.defaultColor,
  };

  return <path style={pathStyle} d={selectBoxD} />;
};
