import { IGraphDiffContext, IGraphEdge, IGraphNode } from "../types";
import {
  GraphEdgeDiffType,
  IDiffGraphEdge,
  IDiffGraphNode,
  IDiffGraphNodeSearcher,
} from "../types/diffGraph";

export function defaultBuildDiffEdges<
  Node extends IGraphNode,
  Edge extends IGraphEdge
>(
  diffNodeSearcher: IDiffGraphNodeSearcher<Node>,
  context: IGraphDiffContext<Node, Edge>
): {
  diffEdges: IDiffGraphEdge<Node, Edge>[];
} {
  const genDiffEdgeId = (
    sourceDiffNode: IDiffGraphNode<Node>,
    targetDiffNode: IDiffGraphNode<Node>,
    sourcePort: string,
    targetPort: string
  ): string =>
    `${sourceDiffNode.id}:${sourcePort}#${targetDiffNode.id}:${targetPort}`;

  const diffGraphEdgeMap: Map<string, IDiffGraphEdge<Node, Edge>> = new Map();

  for (const edge of context.lGraph.edges) {
    const sourceDiffNode = diffNodeSearcher.lNodeId2diffNodeMap.get(
      edge.source
    );
    const targetDiffNode = diffNodeSearcher.rNodeId2diffNodeMap.get(
      edge.target
    );

    if (sourceDiffNode && targetDiffNode) {
      const diffEdgeKey: string = genDiffEdgeId(
        sourceDiffNode,
        targetDiffNode,
        edge.sourcePort,
        edge.targetPort
      );

      const diffEdge: IDiffGraphEdge<Node, Edge> = {
        id: diffEdgeKey,
        diffType: GraphEdgeDiffType.AOnly,
        sourceDiffNode,
        targetDiffNode,
        lEdge: edge,
        rEdge: undefined,
      };
      diffGraphEdgeMap.set(diffEdgeKey, diffEdge);
    }
  }

  for (const edge of context.rGraph.edges) {
    const sourceDiffNode = diffNodeSearcher.rNodeId2diffNodeMap.get(
      edge.source
    );
    const targetDiffNode = diffNodeSearcher.rNodeId2diffNodeMap.get(
      edge.target
    );

    if (sourceDiffNode && targetDiffNode) {
      const diffEdgeKey: string = genDiffEdgeId(
        sourceDiffNode,
        targetDiffNode,
        edge.sourcePort,
        edge.targetPort
      );

      const existedDiffEdge = diffGraphEdgeMap.get(diffEdgeKey);
      if (existedDiffEdge) {
        existedDiffEdge.diffType = GraphEdgeDiffType.equal;
        existedDiffEdge.rEdge = edge;
      } else {
        const diffEdge: IDiffGraphEdge<Node, Edge> = {
          id: diffEdgeKey,
          diffType: GraphEdgeDiffType.BOnly,
          sourceDiffNode,
          targetDiffNode,
          lEdge: undefined,
          rEdge: edge,
        };
        diffGraphEdgeMap.set(diffEdgeKey, diffEdge);
      }
    }
  }
  return {
    diffEdges: Array.from(diffGraphEdgeMap.values()),
  };
}
