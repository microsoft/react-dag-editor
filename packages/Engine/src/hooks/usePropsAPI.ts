import * as React from "react";
import { PropsAPIContext } from "../contexts";
import { IPropsAPI } from "../props-api/IPropsAPI";

export const usePropsAPI = <
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
>(): IPropsAPI<NodeData, EdgeData, PortData> => {
  return React.useContext(PropsAPIContext) as IPropsAPI<
    NodeData,
    EdgeData,
    PortData
  >;
};
