import * as React from "react";
import { ITransformMatrix } from "../../models/geometry";
import { GraphModel } from "../../models/GraphModel";
import { Transform } from "../Transform";
import { ReadonlyNodeTree } from "../tree/ReadonlyNodeTree";

export interface IReadonlyGraphProps {
  data: GraphModel;
  transformMatrix: ITransformMatrix;
  style?: React.CSSProperties;
}

export const StaticGraph: React.FunctionComponent<IReadonlyGraphProps> = props => {
  const { nodes } = props.data;

  const style: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    ...props.style
  };

  return (
    <svg style={style}>
      <Transform matrix={props.transformMatrix}>
        <ReadonlyNodeTree tree={nodes} />
      </Transform>
    </svg>
  );
};
