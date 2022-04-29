import { useContext } from "react";
import {
  GraphStateContext,
  GraphValueContext,
  IGraphStateContext,
} from "../contexts/GraphStateContext";
import { GraphModel } from "../models/GraphModel";

export const useGraphState = <Action = never>(): IGraphStateContext<Action> => {
  return useContext(GraphStateContext) as IGraphStateContext<Action>;
};

export const useGraphData = (): GraphModel => {
  return useContext(GraphValueContext) as GraphModel;
};
