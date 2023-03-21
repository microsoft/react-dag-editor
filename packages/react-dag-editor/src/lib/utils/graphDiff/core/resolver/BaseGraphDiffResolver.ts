import {
  IGraphDiffContext,
  IGraphDiffResolver,
  IGraphEdge,
  IGraphNode,
  IGraphNodeDiffResult,
  IMapping,
} from "../types";
import { defaultBuildCandidateMapping } from "./defaultBuildCandidateMapping";
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
