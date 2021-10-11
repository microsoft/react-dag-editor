import * as React from "react";
import { defaultColors } from "../common/constants";
import { useGraphConfig } from "../hooks/context";
import type { IDummyNodes } from "../models/dummy-node";
import type { GraphModel } from "../models/GraphModel";
import { getNodeConfig } from "../utils";
import { Slots } from "./Slots/Slots";

interface IAnimatingNodeGroup {
  dummyNodes: IDummyNodes;
  graphData: GraphModel;
}

export const AnimatingNodeGroup: React.FunctionComponent<IAnimatingNodeGroup> = (props) => {
  const { dummyNodes, graphData } = props;
  const graphConfig = useGraphConfig();
  const { dWidth, dHeight } = dummyNodes;
  const dx = dummyNodes.alignedDX ?? dummyNodes.dx;
  const dy = dummyNodes.alignedDY ?? dummyNodes.dy;
  return (
    <g>
      {dummyNodes.nodes.map((dummyNode) => {
        const node = graphData.nodes.get(dummyNode.id);
        if (!node) {
          return null;
        }
        const x = dummyNode.x + dx;
        const y = dummyNode.y + dy;
        const width = dummyNode.width + dWidth;
        const height = dummyNode.height + dHeight;
        const nodeConfig = getNodeConfig(node, graphConfig);

        if (nodeConfig?.renderDummy) {
          return nodeConfig.renderDummy({
            ...node.inner,
            x,
            y,
            width,
            height,
          });
        }
        return (
          <Slots.NodeFrame height={height} width={width} key="node-frame">
            <rect
              key={node.id}
              transform={`translate(${x},${y})`}
              height={height}
              width={width}
              stroke={defaultColors.dummyNodeStroke}
              strokeDasharray="4"
              fill="none"
            />
          </Slots.NodeFrame>
        );
      })}
    </g>
  );
};
