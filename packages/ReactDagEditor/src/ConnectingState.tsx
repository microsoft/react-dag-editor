import * as React from "react";
import { ConnectingStateContext, IConnectingStateContext } from "./contexts/ConnectingStateContext";
import { GraphModel } from "./models/GraphModel";
import { NodeModel } from "./models/NodeModel";
import { ICanvasPort } from "./models/port";
import { IConnectingState } from "./models/state";

interface IProps {
  data: GraphModel;
  connectState: IConnectingState | undefined;
}

export const ConnectingState: React.FunctionComponent<IProps> = ({ children, data, connectState }) => {
  let sourceNode: NodeModel | undefined;
  let sourcePort: ICanvasPort | undefined;
  let targetNode: NodeModel | undefined;
  let targetPort: ICanvasPort | undefined;
  if (connectState) {
    sourceNode = data.nodes.get(connectState.sourceNode);
    sourcePort = sourceNode?.getPort(connectState.sourcePort);
    targetNode = connectState.targetNode ? data.nodes.get(connectState.targetNode) : undefined;
    targetPort = connectState.targetPort ? targetNode?.getPort(connectState.targetPort) : undefined;
  }
  const context: IConnectingStateContext = React.useMemo(
    () => ({
      sourceNode,
      sourcePort,
      targetNode,
      targetPort
    }),
    [sourceNode, sourcePort, targetNode, targetPort]
  );
  return <ConnectingStateContext.Provider value={context}>{children}</ConnectingStateContext.Provider>;
};

ConnectingState.displayName = "ConnectingState";
