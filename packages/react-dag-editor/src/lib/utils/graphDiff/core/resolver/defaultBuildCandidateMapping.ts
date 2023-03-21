import {
  IGraphDiffContext,
  IGraphDiffResolver,
  IGraphEdge,
  IGraphNode,
  IMapping,
} from "../types";

export function defaultBuildCandidateMapping<
  Node extends IGraphNode,
  Edge extends IGraphEdge
>(
  context: IGraphDiffContext<Node, Edge>,
  resolver: IGraphDiffResolver<Node, Edge>
): IMapping<Node>[] {
  const { ABOnlyCostThreshold, lGraph, rGraph } = context;
  const lNodes: Node[] = lGraph.nodes;
  const rNodes: Node[] = rGraph.nodes;
  const candidates: IMapping<Node>[] = [];

  for (let i = 0; i < lNodes.length; ++i) {
    const lNode = lNodes[i];
    for (let j = 0; j < rNodes.length; ++j) {
      const rNode = rNodes[j];
      if (rNode && resolver.areSameNodes(lNode, rNode).same) {
        const structureDiffCost: number = resolver.calcStructureDiffCost(
          lNode,
          rNode,
          context
        );
        const propertyDiffCost: number = resolver.calcPropertyDiffCost(
          lNode,
          rNode,
          context
        );
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
}
