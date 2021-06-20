import * as React from "react";
import { AlignmentLinesContext } from "../contexts/AlignmentLinesContext";
import { Line } from "./Line";

interface IProps {
  style?: React.CSSProperties;
}

const AlignmentLines = React.memo<IProps>(({ style }) => {
  const alignmentLines = React.useContext(AlignmentLinesContext);
  return (
    <>
      {alignmentLines.map((l, index) => {
        if (l.visible) {
          return <Line key={index} line={l} style={style} />;
        }
        return null;
      })}
    </>
  );
});

AlignmentLines.displayName = "AlignmentLines";

export { AlignmentLines };
