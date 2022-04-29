import { createContext } from "react";
import type { NodeModel } from "../models/NodeModel";
import type { PortModel } from "../models/PortModel";

export interface IConnectingStateContext {
  sourceNode: NodeModel | undefined;
  sourcePort: PortModel | undefined;
  targetNode: NodeModel | undefined;
  targetPort: PortModel | undefined;
}

export const EMPTY_CONNECT_CONTEXT: IConnectingStateContext = {
  sourceNode: undefined,
  sourcePort: undefined,
  targetNode: undefined,
  targetPort: undefined,
};

const ConnectingStateContext = createContext<IConnectingStateContext>(
  EMPTY_CONNECT_CONTEXT
);

ConnectingStateContext.displayName = "ConnectingStateContext";

export { ConnectingStateContext };
