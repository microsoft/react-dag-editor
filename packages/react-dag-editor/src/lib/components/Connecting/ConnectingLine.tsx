import * as React from "react";
import { defaultColors } from "../../common/constants";
import { getCurvePathD } from "../../utils";
import { ILine } from "../Line";

interface IConnectingLineProps {
  connectingLine: ILine;
  autoAttachLine: ILine;
  styles?: React.CSSProperties;
}

export const ConnectingLine: React.FunctionComponent<IConnectingLineProps> = props => {
  const { autoAttachLine, connectingLine, styles } = props;

  const strokeColor = styles?.stroke || defaultColors.primaryColor;
  const fill = styles?.fill || "none";
  const strokeDasharray = styles?.strokeDasharray || "4,4";

  const connectingLineStroke = connectingLine.visible ? strokeColor : "none";

  return (
    <g>
      <defs>
        <marker
          id="markerArrow"
          markerWidth="10"
          markerHeight="10"
          refX="6"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L6,5 L0,10" style={{ stroke: connectingLineStroke, fill: "none" }} />
        </marker>
      </defs>
      {/* connecting line */}
      <line
        x1={connectingLine.x1}
        y1={connectingLine.y1}
        x2={connectingLine.x2}
        y2={connectingLine.y2}
        style={{ stroke: connectingLineStroke, fill, strokeDasharray }}
        markerEnd="url(#markerArrow)"
      />
      {/* temporary edge, for automatically attach effect*/}
      <path
        d={getCurvePathD(autoAttachLine.x2, autoAttachLine.x1, autoAttachLine.y2, autoAttachLine.y1)}
        style={{
          stroke: autoAttachLine.visible ? strokeColor : "none",
          fill: "none",
        }}
      />
    </g>
  );
};
