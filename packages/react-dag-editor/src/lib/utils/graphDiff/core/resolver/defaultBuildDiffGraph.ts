import {
  IABOnlyNode,
  IGraphDiffContext,
  IGraphDiffResolver,
  IGraphEdge,
  IGraphNode,
  IMapping,
} from "../types";
import { IDiffGraph } from "../types/diffGraph";

export function defaultBuildDiffGraph<
  Node extends IGraphNode,
  Edge extends IGraphEdge
>(
  mappings: IMapping<Node>[],
  abOnlyNodes: IABOnlyNode<Node>[],
  context: IGraphDiffContext<Node, Edge>,
  resolver: IGraphDiffResolver<Node, Edge>
): IDiffGraph<Node, Edge> {
  const { diffNodes, diffNodeSearcher } = resolver.buildDiffNodes(
    mappings,
    abOnlyNodes,
    context
  );
  const { diffEdges } = resolver.buildDiffEdges(diffNodeSearcher, context);
  return { diffNodes, diffEdges };
}
