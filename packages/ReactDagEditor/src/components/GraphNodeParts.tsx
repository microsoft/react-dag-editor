import * as React from "react";
import { GraphSettingsContext } from "../contexts/GraphSettingsContext";
import { VirtualizationContext } from "../contexts/VirtualizationContext";
import { NodeModel } from "../models/NodeModel";
import { getNodeConfig, isNodeEditing, isPointInRect } from "../utils";
import { GraphNode, IGraphNodeCommonProps } from "./GraphNode";
import { GraphNodeControlPoints } from "./GraphNodeControlPoints";
import { GraphOneNodePorts, IGraphOneNodePortsProps } from "./GraphOneNodePorts";

export interface IGraphNodePartsProps
  extends Required<Omit<IGraphNodeCommonProps, "viewport">>,
    Omit<IGraphOneNodePortsProps, "viewport"> {
  node: NodeModel;
  isNodeResizable: boolean;
}

const GraphNodeParts = ({ node, isNodeResizable, ...commonProps }: IGraphNodePartsProps) => {
  const virtualization = React.useContext(VirtualizationContext);
  const { renderedArea, viewport } = virtualization;
  const { graphConfig } = React.useContext(GraphSettingsContext);
  const nodeConfig = getNodeConfig(node, graphConfig);

  const isVisible = isPointInRect(renderedArea, node);

  React.useLayoutEffect(() => {
    if (isVisible) {
      virtualization.renderedEdges.add(node.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualization]);

  if (!isVisible || !nodeConfig) {
    return null;
  }

  return (
    <>
      <GraphNode {...commonProps} node={node} viewport={viewport} nodeConfig={nodeConfig} />
      <GraphOneNodePorts {...commonProps} node={node} viewport={viewport} graphConfig={graphConfig} />
      {isNodeResizable && isNodeEditing(node) && <GraphNodeControlPoints node={node} nodeConfig={nodeConfig} />}
    </>
  );
};

const GraphNodePartsMemo = React.memo(GraphNodeParts);

export { GraphNodePartsMemo as GraphNodeParts };
