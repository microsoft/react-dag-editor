import * as React from "react";
import { useGraphConfig } from "../hooks/context";
import { GraphNodeState } from "../models/element-state";
import type { IViewport } from "../models/geometry";
import type { NodeModel } from "../models/NodeModel";
import { getNodeConfig, hasState } from "../utils";

interface IProps {
  node?: NodeModel;
  viewport: Required<IViewport>;
}

export const NodeTooltips: React.FunctionComponent<IProps> = (props) => {
  const { node, viewport } = props;
  const graphConfig = useGraphConfig();

  if (!node) {
    return null;
  }

  if (!hasState(GraphNodeState.activated)(node.state)) {
    return null;
  }

  const nodeConfig = getNodeConfig(node, graphConfig);

  if (!nodeConfig?.renderTooltips) {
    return null;
  }

  return (
    <div className="node-tooltips">
      {nodeConfig.renderTooltips({
        model: node,
        viewport,
      })}
    </div>
  );
};
