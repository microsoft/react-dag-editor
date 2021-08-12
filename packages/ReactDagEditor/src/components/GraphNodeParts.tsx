import * as React from "react";
import { VirtualizationContext } from "../contexts/VirtualizationContext";
import { NodeModel } from "../models/NodeModel";
import { isNodeEditing, isPointInRect } from "../utils";
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

  const visible = isPointInRect(renderedArea, node);

  if (!visible) {
    return null;
  }

  return (
    <>
      <GraphNode {...commonProps} node={node} viewport={viewport} />
      <GraphOneNodePorts {...commonProps} node={node} viewport={viewport} />
      {isNodeResizable && isNodeEditing(node) && (
        <GraphNodeControlPoints node={node} eventChannel={commonProps.eventChannel} />
      )}
    </>
  );
};

const GraphNodePartsMemo = React.memo(GraphNodeParts);

export { GraphNodePartsMemo as GraphNodeParts };
