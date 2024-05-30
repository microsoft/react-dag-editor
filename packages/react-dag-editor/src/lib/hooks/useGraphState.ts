import { useContext } from "react";
import { GraphStateContext, GraphValueContext, IGraphStateContext } from "../contexts/GraphStateContext";
import { GraphModel } from "../models/GraphModel";

export const useGraphState = <
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never,
>(): IGraphStateContext<NodeData, EdgeData, PortData, Action> => {
  return useContext(GraphStateContext) as IGraphStateContext<NodeData, EdgeData, PortData, Action>;
};

export const useGraphData = <NodeData, EdgeData, PortData>(): GraphModel<NodeData, EdgeData, PortData> => {
  return useContext(GraphValueContext) as GraphModel<NodeData, EdgeData, PortData>;
};
