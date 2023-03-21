import {
  IGraphDiffContext,
  IGraphDiffResolver,
  IGraphEdge,
  IGraphNode,
  IGraphNodeOutgoingEdge,
} from "../types";

export const defaultCalcStructureDiffCost = <
  Node extends IGraphNode,
  Edge extends IGraphEdge
>(
  lNode: Node,
  rNode: Node,
  context: IGraphDiffContext<Node, Edge>,
  resolver: IGraphDiffResolver<Node, Edge>
): number => {
  const lNodeWithStructure = context.lNodesMap.get(lNode.id);
  const rNodeWithStructure = context.rNodesMap.get(rNode.id);

  const ancestralDiffCost: number = structureDiffCost(
    lNodeWithStructure?.inEdges ?? [],
    rNodeWithStructure?.inEdges ?? []
  );
  const descendantDiffCost: number = structureDiffCost(
    lNodeWithStructure?.outEdges ?? [],
    rNodeWithStructure?.outEdges ?? []
  );
  return ancestralDiffCost + descendantDiffCost;

  function structureDiffCost(
    lOutgoingEdges: IGraphNodeOutgoingEdge<Node, Edge>[],
    rOutgoingEdges: IGraphNodeOutgoingEdge<Node, Edge>[]
  ): number {
    const totalOutgoingEdges: number =
      lOutgoingEdges.length + rOutgoingEdges.length;
    if (totalOutgoingEdges === 0) {
      return 0;
    }

    const lPairedSet: Set<number> = new Set();
    const rPairedSet: Set<number> = new Set();

    // Find exact same outgoing edge pairs.
    for (let i = 0; i < lOutgoingEdges.length; i += 1) {
      const loe = lOutgoingEdges[i];
      const j: number = rOutgoingEdges.findIndex(
        (roe, idx) =>
          !rPairedSet.has(idx) &&
          loe.portId === roe.portId &&
          loe.targetPortId === roe.targetPortId &&
          loe.targetNode.hash &&
          loe.targetNode.hash === roe.targetNode.hash
      );

      if (j > -1) {
        lPairedSet.add(i);
        rPairedSet.add(j);
      }
    }
    const countOfExactSame: number = lPairedSet.size;

    // Find strong similar outgoing edge pairs.
    for (let i = 0; i < lOutgoingEdges.length; i += 1) {
      const loe = lOutgoingEdges[i];
      if (!lPairedSet.has(i)) {
        const j: number = rOutgoingEdges.findIndex(
          (roe, idx) =>
            !rPairedSet.has(idx) &&
            resolver.areSameNodes(loe.targetNode, roe.targetNode).same
        );
        if (j > -1) {
          lPairedSet.add(i);
          rPairedSet.add(j);
        }
      }
    }
    const countOfStrongSimilar: number = lPairedSet.size - countOfExactSame;

    // Find weak similar node resource pairs.
    for (let i = 0; i < lOutgoingEdges.length; i += 1) {
      const loe = lOutgoingEdges[i];
      if (!lPairedSet.has(i)) {
        const j: number = rOutgoingEdges.findIndex(
          (roe, idx) =>
            !rPairedSet.has(idx) &&
            resolver.areSameNodes(loe.targetNode, roe.targetNode).same
        );
        if (j > -1) {
          lPairedSet.add(i);
          rPairedSet.add(j);
        }
      }
    }
    const countOfWeakSimilar: number =
      lPairedSet.size - countOfExactSame - countOfStrongSimilar;

    const countOfNotSimilar: number = totalOutgoingEdges - lPairedSet.size * 2;
    const totalDiff: number =
      countOfNotSimilar * 5 + countOfWeakSimilar * 2 + countOfStrongSimilar;
    const cost: number = totalDiff * context.StructureDiffCostRate;
    return cost;
  }
};
