import * as React from "react";
import { GraphConfigContext, IGraphConfig } from "../contexts";
import { useTheme } from "../hooks";
import { GraphModel } from "../models/GraphModel";
import { getNodeConfig } from "../utils";
import { IDummyNodes } from "./dummyNodes";

interface IAnimatingNodeGroup {
  dummyNodes: IDummyNodes;
  graphData: GraphModel;
}

export const AnimatingNodeGroup: React.FunctionComponent<IAnimatingNodeGroup> = props => {
  const { dummyNodes, graphData } = props;
  const graphConfig = React.useContext<IGraphConfig>(GraphConfigContext);
  const { theme } = useTheme();
  const { dWidth, dHeight } = dummyNodes;
  const dx = dummyNodes.alignedDX ?? dummyNodes.dx;
  const dy = dummyNodes.alignedDY ?? dummyNodes.dy;
  return (
    <g>
      {dummyNodes.nodes.map(dummyNode => {
        const node = graphData.nodes.get(dummyNode.id);
        if (!node) {
          return null;
        }
        const x = dummyNode.x + dx;
        const y = dummyNode.y + dy;
        const width = dummyNode.width + dWidth;
        const height = dummyNode.height + dHeight;
        const nodeConfig = getNodeConfig(node, graphConfig);

        if (nodeConfig.renderDummy) {
          return nodeConfig.renderDummy(
            {
              ...node.inner,
              x,
              y,
              width,
              height
            },
            theme
          );
        }
        return (
          <rect
            key={node.id}
            transform={`translate(${x},${y})`}
            height={height}
            width={width}
            stroke={theme.dummyNodeStroke}
            strokeDasharray="4"
            fill="none"
          />
        );
      })}
    </g>
  );
};
