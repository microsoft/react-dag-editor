import {
  IGraphDiffContext,
  IGraphEdge,
  IGraphNode,
  IGraphNodeOutgoingEdge,
  IGraphNodeWithStructure,
} from "../types";

export const calculateStructureDiffCost = <
  Node extends IGraphNode,
  Edge extends IGraphEdge
>(
  lNode: IGraphNodeWithStructure<Node, Edge>,
  rNode: IGraphNodeWithStructure<Node, Edge>,
  lNodesMap: Map<string, IGraphNodeWithStructure<Node, Edge>>,
  rNodesMap: Map<string, IGraphNodeWithStructure<Node, Edge>>,
  context: IGraphDiffContext<Node, Edge>
): number => {
  const { enums, methods } = context;

  const structureDiffCost = (
    lOutgoingEdges: IGraphNodeOutgoingEdge<Node, Edge>[],
    rOutgoingEdges: IGraphNodeOutgoingEdge<Node, Edge>[]
  ): number => {
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
            methods.areSameNodes(
              loe.targetNode,
              roe.targetNode,
              lNodesMap,
              rNodesMap
            ).same
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
            methods.areSameNodes(
              loe.targetNode,
              roe.targetNode,
              lNodesMap,
              rNodesMap
            ).same
        );
        if (j > -1) {
          lPairedSet.add(i);
          rPairedSet.add(j);
        }
      }
    }
    const countOfWeakSimilar: number =
      lPairedSet.size - countOfExactSame - countOfStrongSimilar;

    const countOfNotSimilar: number = totalOutgoingEdges - lPairedSet.size;
    const totalDiff: number =
      countOfNotSimilar * 5 + countOfWeakSimilar * 2 + countOfStrongSimilar;
    const cost: number = totalDiff * enums.StructureDiffCostRate;
    return cost;
  };

  const ancestralDiffCost: number = structureDiffCost(
    lNode.inEdges,
    rNode.inEdges
  );
  const descendantDiffCost: number = structureDiffCost(
    lNode.outEdges,
    rNode.outEdges
  );
  return ancestralDiffCost + descendantDiffCost;
};
