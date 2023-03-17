import {
  IGraph,
  IGraphDiffContext,
  IGraphEdge,
  IGraphNode,
  IMapping,
} from "../types";

export const defaultBuildCandidateMapping = <
  Node extends IGraphNode,
  Edge extends IGraphEdge
>(
  lGraph: IGraph<Node, Edge>,
  rGraph: IGraph<Node, Edge>,
  context: IGraphDiffContext<Node, Edge>
): IMapping<Node>[] => {
  const {
    ABOnlyCostThreshold,
    areSameNodes,
    calcStructureDiffCost,
    calcPropertyDiffCost,
  } = context;

  const lNodes: Node[] = lGraph.nodes;
  const rNodes: Node[] = rGraph.nodes;
  const candidates: IMapping<Node>[] = [];
  for (let i = 0; i < lNodes.length; ++i) {
    const lNode = lNodes[i];
    for (let j = 0; j < rNodes.length; ++j) {
      const rNode = rNodes[j];
      if (rNode && areSameNodes(lNode, rNode).same) {
        const structureDiffCost: number = calcStructureDiffCost(lNode, rNode);
        const propertyDiffCost: number = calcPropertyDiffCost(lNode, rNode);
        const diffCost: number = structureDiffCost + propertyDiffCost;
        if (diffCost < ABOnlyCostThreshold) {
          candidates.push({
            lNode,
            rNode,
            cost: {
              total: diffCost,
              property: propertyDiffCost,
              structure: structureDiffCost,
            },
          });
        }
      }
    }
  }
  return candidates;
};
