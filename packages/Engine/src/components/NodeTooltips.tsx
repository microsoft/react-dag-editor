import * as React from "react";
import { GraphConfigContext, IGraphConfig } from "../contexts";
import { IViewport } from "../contexts/GraphStateContext";
import { GraphNodeState } from "../Graph.interface";
import { useTheme } from "../hooks";
import { NodeModel } from "../models/NodeModel";
import { getNodeConfig, hasState } from "../utils";

interface IProps {
  node?: NodeModel;
  viewPort: Required<IViewport>;
}

export const NodeTooltips: React.FunctionComponent<IProps> = props => {
  const { node, viewPort } = props;
  const graphConfig = React.useContext<IGraphConfig>(GraphConfigContext);
  const { theme } = useTheme();

  if (!node) {
    return null;
  }

  if (!hasState(GraphNodeState.activated)(node.state)) {
    return null;
  }

  const nodeConfig = getNodeConfig(node, graphConfig);

  if (!nodeConfig.renderTooltips) {
    return null;
  }

  return (
    <div className="node-tooltips">
      {nodeConfig.renderTooltips({
        model: node,
        containerRect: viewPort.rect,
        zoomPanSettings: viewPort,
        theme,
        viewPort
      })}
    </div>
  );
};
