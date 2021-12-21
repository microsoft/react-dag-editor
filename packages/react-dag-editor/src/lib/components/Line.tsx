import * as React from "react";

export interface ILine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  visible: boolean;
}

export const emptyLine = (): ILine => ({
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  visible: false,
});

interface IAlignmentLineProps {
  line: ILine;
  style?: React.CSSProperties;
}

export const Line: React.FunctionComponent<IAlignmentLineProps> = (props) => {
  const { line, style } = props;

  const lineStyle: React.CSSProperties = {
    // strokeDasharray: "0,0",
    strokeWidth: 1,
    ...style,
    stroke: line.visible ? style?.stroke ?? "#ea4300" : "none",
  };

  return (
    <line
      className="auto-align-hint"
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      style={lineStyle}
    />
  );
};
