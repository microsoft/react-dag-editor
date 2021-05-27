import * as React from "react";
import { GraphModel } from "../..";
import { IZoomPanSettings } from "../../utils";
import { Transform } from "../Transform";
import { ReadonlyNodeTree } from "../tree/ReadonlyNodeTree";

export interface IReadonlyGraphProps {
  data: GraphModel;
  zoomPanSettings: IZoomPanSettings;
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
      <Transform matrix={props.zoomPanSettings.transformMatrix}>
        <ReadonlyNodeTree tree={nodes} />
      </Transform>
    </svg>
  );
};
