import * as React from "react";
import { defaultColors } from "../../common/constants";
import { useGraphConfig } from "../../hooks/context";
import type { NodeModel } from "../../models/NodeModel";
import { getNodeConfig, getRectHeight, getRectWidth } from "../../utils";

interface IStaticNodeProps {
  node: NodeModel;
}

const StaticNode: React.FunctionComponent<IStaticNodeProps> = (props) => {
  const { node } = props;
  const graphConfig = useGraphConfig();

  const nodeConfig = getNodeConfig(node, graphConfig);

  if (nodeConfig?.renderStatic) {
    return <g>{nodeConfig.renderStatic({ model: node })}</g>;
  }

  const rectHeight = getRectHeight(nodeConfig, node);
  const rectWidth = getRectWidth(nodeConfig, node);

  return (
    <rect
      transform={`translate(${node.x}, ${node.y})`}
      height={rectHeight}
      width={rectWidth}
      fill={defaultColors.dummyNodeStroke}
    />
  );
};

const StaticNodeWithMemo = React.memo(StaticNode, (prevProps, nextProps) => {
  const prevNode = prevProps.node;
  const nextNode = nextProps.node;

  return (
    prevNode.x === nextNode.x &&
    prevNode.y === nextNode.y &&
    prevNode.height === nextNode.height &&
    prevNode.width === nextNode.width
  );
});

export { StaticNodeWithMemo as StaticNode };
