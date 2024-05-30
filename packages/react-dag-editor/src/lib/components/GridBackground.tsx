import * as React from "react";
import { IRectShape } from "../models/geometry";

interface IGridBackgroundProps {
  rect: IRectShape;
  smallGridAttributes?: React.SVGProps<SVGPathElement>;
  gridAttributes?: React.SVGProps<SVGPathElement>;
  backgroundAttributes?: React.SVGProps<SVGRectElement>;
}

export const GridBackground: React.FC<IGridBackgroundProps> = ({
  smallGridAttributes,
  gridAttributes,
  backgroundAttributes,
  rect,
}) => {
  const rectX = rect.minX;
  const rectY = rect.minY;
  const width = rect.maxX - rect.minX;
  const height = rect.maxY - rect.minY;

  return (
    <>
      <defs>
        <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5" {...smallGridAttributes} />
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#smallGrid)" />
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1" {...gridAttributes} />
        </pattern>
      </defs>
      <rect x={rectX} y={rectY} width={width} height={height} fill="url(#grid)" {...backgroundAttributes} />
    </>
  );
};
