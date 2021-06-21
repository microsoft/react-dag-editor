import { createContext } from "react";
import { ICanvasPort } from "../Graph.interface";
import { NodeModel } from "../models/NodeModel";

export interface IConnectingStateContext {
  sourceNode: NodeModel | undefined;
  sourcePort: ICanvasPort | undefined;
  targetNode: NodeModel | undefined;
  targetPort: ICanvasPort | undefined;
}

export const EMPTY_CONNECT_CONTEXT: IConnectingStateContext = {
  sourceNode: undefined,
  sourcePort: undefined,
  targetNode: undefined,
  targetPort: undefined
};

const ConnectingStateContext = createContext<IConnectingStateContext>(EMPTY_CONNECT_CONTEXT);

ConnectingStateContext.displayName = "ConnectingStateContext";

export { ConnectingStateContext };
