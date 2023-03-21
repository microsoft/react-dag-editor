import { createMcmf } from "@algorithm.ts/mcmf";
import { IGraphNode, IMapping } from "../types";

const mcmf = createMcmf();

/**
 * Find the maximum matching with minimum cost in bipartite graph.
 *
 * @returns
 */
export const findBipartiteGraphMaxMapping = <Node extends IGraphNode>(
  candidates: IMapping<Node>[]
): IMapping<Node>[] => {
  const sourceId = 0;
  const sinkId = sourceId + 1;
  mcmf.init(sourceId, sinkId, 2 + candidates.length * 2);

  let nextFlowNodeId = sinkId + 1;
  const fromId2Mapping: Map<number, IMapping<Node>> = new Map();

  // Link flow source to the left graph node.
  for (const mapping of candidates) {
    const leftFlowNodeId = nextFlowNodeId++;
    const rightFlowNodeId = nextFlowNodeId++;

    fromId2Mapping.set(leftFlowNodeId, mapping);

    // Link flow source to the left graph node.
    mcmf.addEdge(sourceId, leftFlowNodeId, 1, 0);

    // Link left graph node to right graph node.
    mcmf.addEdge(leftFlowNodeId, rightFlowNodeId, 1, mapping.cost.total);

    // Link right graph node to flow sink.
    mcmf.addEdge(rightFlowNodeId, sinkId, 1, 0);
  }

  // Run Min Cost Max Flow.
  mcmf.minCostMaxFlow();

  const filteredMappings: IMapping<Node>[] = [];
  mcmf.solve(({ edges, edgeTot }) => {
    for (let i = 0; i < edgeTot; i += 1) {
      const edge = edges[i];

      if (
        edge.cap > 0 &&
        edge.flow === edge.cap &&
        edge.from !== sourceId &&
        edge.to !== sinkId
      ) {
        const mapping = fromId2Mapping.get(edge.from);
        if (mapping) {
          filteredMappings.push(mapping);
        }
      }
    }
  });

  fromId2Mapping.clear();
  return filteredMappings;
};
