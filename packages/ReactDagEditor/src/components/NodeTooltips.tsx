import * as React from "react";
import { GraphConfigContext } from "../contexts";
import { GraphNodeState } from "../models/element-state";
import { useTheme } from "../hooks";
import { IViewport } from "../models/geometry";
import { NodeModel } from "../models/NodeModel";
import { IGraphConfig } from "../settings/IGraphConfig";
import { getNodeConfig, hasState } from "../utils";

interface IProps {
  node?: NodeModel;
  viewport: Required<IViewport>;
}

export const NodeTooltips: React.FunctionComponent<IProps> = props => {
  const { node, viewport } = props;
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
        theme,
        viewport
      })}
    </div>
  );
};
