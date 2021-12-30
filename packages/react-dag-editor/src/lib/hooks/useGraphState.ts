import { useContext } from "react";
import {
  GraphStateContext,
  GraphValueContext,
  IGraphStateContext,
} from "../contexts/GraphStateContext";
import { ContentState } from "../models/ContentState";

export const useGraphState = <Action = never>(): IGraphStateContext => {
  return useContext(GraphStateContext) as IGraphStateContext<Action>;
};

export const useGraphData = (): ContentState => {
  return useContext(GraphValueContext);
};
