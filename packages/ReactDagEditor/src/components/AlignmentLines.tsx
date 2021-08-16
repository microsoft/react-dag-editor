import * as React from "react";
import { useAlignmentLines } from "../hooks/context";
import { Line } from "./Line";

interface IProps {
  style?: React.CSSProperties;
}

const AlignmentLines = React.memo<IProps>(({ style }) => {
  const alignmentLines = useAlignmentLines();
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
