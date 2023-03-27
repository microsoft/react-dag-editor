import * as React from "react";
import { ITransformMatrix } from "../models/geometry";

interface IProps {
  matrix: ITransformMatrix;
}

export const Transform: React.FunctionComponent<
  React.PropsWithChildren<IProps>
> = ({ matrix, children }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transform = React.useMemo(() => `matrix(${matrix.join(" ")})`, matrix);
  return <g transform={transform}>{children}</g>;
};
