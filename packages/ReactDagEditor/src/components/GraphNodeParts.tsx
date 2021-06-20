import * as React from "react";
import { AutoZoomFitContext } from "../contexts/AutoZoomFitContext";
import { VirtualizationContext } from "../contexts/VirtualizationContext";
import { VirtualizationRenderedContext } from "../contexts/VirtualizationRenderedContext";
import { NodeModel } from "../models/NodeModel";
import { isNodeEditing, isPointInRect } from "../utils";
import { GraphNode, IGraphNodeCommonProps } from "./GraphNode";
import { GraphNodeControlPoints } from "./GraphNodeControlPoints";
import { GraphOneNodePorts, IGraphOneNodePortsProps } from "./GraphOneNodePorts";

export interface IGraphNodePartsProps
  extends Required<Omit<IGraphNodeCommonProps, "viewPort">>,
    Omit<IGraphOneNodePortsProps, "viewPort"> {
  node: NodeModel;
  isNodeResizable: boolean;
}

const GraphNodeParts = ({ node, isNodeResizable, ...commonProps }: IGraphNodePartsProps) => {
  const shouldAutoZoomToFit = React.useContext(AutoZoomFitContext);
  React.useLayoutEffect(() => {
    shouldAutoZoomToFit.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.x, node.y]);

  const virtualization = React.useContext(VirtualizationContext);
  const { renderedArea, viewPort } = virtualization;
  const renderedContext = React.useContext(VirtualizationRenderedContext);

  const visible = isPointInRect(renderedArea, node);

  if (!visible) {
    renderedContext.nodes.delete(node.id);
    return null;
  }

  renderedContext.nodes.add(node.id);

  return (
    <>
      <GraphNode {...commonProps} node={node} viewPort={viewPort} />
      <GraphOneNodePorts {...commonProps} node={node} viewPort={viewPort} />
      {isNodeResizable && isNodeEditing(node) && (
        <GraphNodeControlPoints node={node} eventChannel={commonProps.eventChannel} />
      )}
    </>
  );
};

const GraphNodePartsMemo = React.memo(GraphNodeParts);

export { GraphNodePartsMemo as GraphNodeParts };
