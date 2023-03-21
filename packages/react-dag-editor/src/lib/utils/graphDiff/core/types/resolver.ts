import { IGraphDiffContext } from "./context";
import {
  IABOnlyNode,
  IDiffGraph,
  IDiffGraphEdge,
  IDiffGraphNode,
  IDiffGraphNodeSearcher,
} from "./diffGraph";
import { IGraphEdge, IGraphNode, IGraphNodeDiffCost } from "./graph";

export interface IMapping<Node extends IGraphNode> {
  lNode: Node;
  rNode: Node;
  cost: IGraphNodeDiffCost;
}

export interface IGraphNodeDiffResult {
  same: boolean;
  /**
   * Why are the two nodes considered different.
   */
  reason?: string;
  /**
   * Additional debug data.
   */
  details?: unknown;
}

export interface IGraphDiffResolver<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  areSameNodes(lNode: Node, rNode: Node): IGraphNodeDiffResult;

  buildCandidateMapping(
    context: IGraphDiffContext<Node, Edge>
  ): IMapping<Node>[];

  buildDiffEdges(
    diffNodeSearcher: IDiffGraphNodeSearcher<Node>,
    context: IGraphDiffContext<Node, Edge>
  ): {
    diffEdges: IDiffGraphEdge<Node, Edge>[];
  };

  buildDiffGraph(
    mappings: IMapping<Node>[],
    abOnlyNodes: IABOnlyNode<Node>[],
    context: IGraphDiffContext<Node, Edge>
  ): IDiffGraph<Node, Edge>;

  buildDiffNodes(
    mappings: IMapping<Node>[],
    abOnlyNodes: IABOnlyNode<Node>[],
    context: IGraphDiffContext<Node, Edge>
  ): {
    diffNodes: IDiffGraphNode<Node>[];
    diffNodeSearcher: IDiffGraphNodeSearcher<Node>;
  };

  calcStructureDiffCost(
    lNode: Node,
    rNode: Node,
    context: IGraphDiffContext<Node, Edge>
  ): number;

  calcPropertyDiffCost(
    lNode: Node,
    rNode: Node,
    context: IGraphDiffContext<Node, Edge>
  ): number;

  // Check if two nodes have same ports.
  hasSamePorts(lNode: Node, rNode: Node): boolean;
}
