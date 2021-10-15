import * as React from "react";
import { useGraphConfig } from "../hooks/context";
import type { IViewport } from "../models/geometry";
import type { NodeModel } from "../models/NodeModel";
import { GraphNodeStatus } from "../models/status";
import { getNodeConfig } from "../utils";
import * as Bitset from "../utils/bitset";

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

  if (!Bitset.has(GraphNodeStatus.Activated)(node.status)) {
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
