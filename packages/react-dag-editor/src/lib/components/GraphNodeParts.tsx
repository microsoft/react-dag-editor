import * as React from "react";
import { useVirtualization } from "../hooks/context";
import { useGetMouseDownOnAnchor } from "../hooks/useGetMouseDownOnAnchor";
import { NodeModel } from "../models/NodeModel";
import { isNodeEditing } from "../models/status";
import { isPointInRect } from "../utils";
import { GraphNode, IGraphNodeCommonProps } from "./GraphNode";
import { GraphNodeAnchors, RenderNodeAnchors } from "./NodeAnchors";
import {
  GraphOneNodePorts,
  IGraphOneNodePortsProps,
} from "./GraphOneNodePorts";

export interface IGraphNodePartsProps
  extends Required<Omit<IGraphNodeCommonProps, "viewport">>,
    Omit<IGraphOneNodePortsProps, "viewport"> {
  node: NodeModel;
  isNodeResizable: boolean;
  renderNodeAnchors?: RenderNodeAnchors;
}

const GraphNodeParts = ({
  node,
  isNodeResizable,
  renderNodeAnchors,
  ...commonProps
}: IGraphNodePartsProps) => {
  const virtualization = useVirtualization();
  const { renderedArea, viewport } = virtualization;
  const getMouseDown = useGetMouseDownOnAnchor(node, commonProps.eventChannel);
  const isVisible = isPointInRect(renderedArea, node);

  React.useLayoutEffect(() => {
    if (isVisible) {
      virtualization.renderedEdges.add(node.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualization]);

  if (!isVisible) {
    return null;
  }

  let nodeAnchors;
  if (isNodeResizable && isNodeEditing(node)) {
    const defaultAnchors = (
      <GraphNodeAnchors node={node} getMouseDown={getMouseDown} />
    );
    nodeAnchors = renderNodeAnchors
      ? renderNodeAnchors(node, getMouseDown, defaultAnchors)
      : defaultAnchors;
  }

  return (
    <>
      <GraphNode {...commonProps} node={node} viewport={viewport} />
      <GraphOneNodePorts {...commonProps} node={node} viewport={viewport} />
      {nodeAnchors}
    </>
  );
};

const GraphNodePartsMemo = React.memo(GraphNodeParts);

export { GraphNodePartsMemo as GraphNodeParts };
