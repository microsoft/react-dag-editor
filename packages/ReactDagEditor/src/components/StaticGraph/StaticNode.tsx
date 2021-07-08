import * as React from "react";
import { GraphConfigContext, IGraphConfig } from "../../contexts";
import { useTheme } from "../../hooks";
import { ICanvasNode } from "../../models/node";
import { getNodeConfig, getRectHeight, getRectWidth } from "../../utils";

interface IStaticNodeProps {
  node: ICanvasNode;
}

const StaticNode: React.FunctionComponent<IStaticNodeProps> = props => {
  const { node } = props;
  const graphConfigContext = React.useContext<IGraphConfig>(GraphConfigContext);
  const { theme } = useTheme();

  const nodeConfig = getNodeConfig(node, graphConfigContext);

  if (nodeConfig.renderStatic) {
    return <g>{nodeConfig.renderStatic({ model: node, theme })}</g>;
  }

  const rectHeight = getRectHeight<ICanvasNode>(nodeConfig, node);
  const rectWidth = getRectWidth<ICanvasNode>(nodeConfig, node);

  return (
    <rect
      transform={`translate(${node.x}, ${node.y})`}
      height={rectHeight}
      width={rectWidth}
      fill={theme.dummyNodeStroke}
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
    prevNode.width === nextNode.width &&
    prevNode.isInSearchResults === nextNode.isInSearchResults &&
    prevNode.isCurrentSearchResult === nextNode.isCurrentSearchResult
  );
});

export { StaticNodeWithMemo as StaticNode };
