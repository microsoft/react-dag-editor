import {
  IABOnlyNode,
  IDiffGraph,
  IDiffGraphEdge,
  IDiffGraphNode,
  IDiffGraphNodeSearcher,
  IGraphDiffContext,
  IGraphDiffResolver,
  IGraphEdge,
  IGraphNode,
  IGraphNodeDiffResult,
  IMapping,
} from "../types";
import { defaultBuildCandidateMapping } from "./defaultBuildCandidateMapping";
import { defaultBuildDiffEdges } from "./defaultBuildDiffEdge";
import { defaultBuildDiffNodes } from "./defaultBuildDiffNode";
import { defaultBuildDiffGraph } from "./defaultBuildDiffGraph";
import { defaultCalcStructureDiffCost } from "./defaultCalcStructureDiffCost";

export abstract class BaseGraphDiffResolver<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> implements IGraphDiffResolver<Node, Edge>
{
  public abstract areSameNodes(lNode: Node, rNode: Node): IGraphNodeDiffResult;

  public buildCandidateMapping(
    context: IGraphDiffContext<Node, Edge>
  ): IMapping<Node>[] {
    return defaultBuildCandidateMapping<Node, Edge>(context, this);
  }

  public buildDiffEdges(
    diffNodeSearcher: IDiffGraphNodeSearcher<Node>,
    context: IGraphDiffContext<Node, Edge>
  ): { diffEdges: IDiffGraphEdge<Node, Edge>[] } {
    return defaultBuildDiffEdges(diffNodeSearcher, context);
  }

  buildDiffGraph(
    mappings: IMapping<Node>[],
    abOnlyNodes: IABOnlyNode<Node>[],
    context: IGraphDiffContext<Node, Edge>
  ): IDiffGraph<Node, Edge> {
    return defaultBuildDiffGraph(mappings, abOnlyNodes, context, this);
  }

  public buildDiffNodes(
    mappings: IMapping<Node>[],
    abOnlyNodes: IABOnlyNode<Node>[],
    _context: IGraphDiffContext<Node, Edge>
  ): {
    diffNodes: IDiffGraphNode<Node>[];
    diffNodeSearcher: IDiffGraphNodeSearcher<Node>;
  } {
    return defaultBuildDiffNodes(mappings, abOnlyNodes, this);
  }

  public calcStructureDiffCost(
    lNode: Node,
    rNode: Node,
    context: IGraphDiffContext<Node, Edge>
  ): number {
    return defaultCalcStructureDiffCost<Node, Edge>(
      lNode,
      rNode,
      context,
      this
    );
  }

  public abstract calcPropertyDiffCost(
    lNode: Node,
    rNode: Node,
    context: IGraphDiffContext<Node, Edge>
  ): number;

  public hasSamePorts(lNode: Node, rNode: Node): boolean {
    if (lNode.ports.length !== rNode.ports.length) {
      return false;
    }

    const lPortSet: Set<string> = new Set<string>(lNode.ports);
    return rNode.ports.every((port) => lPortSet.has(port));
  }
}
