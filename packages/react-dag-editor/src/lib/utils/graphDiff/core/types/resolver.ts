import { IGraphDiffContext } from "./context";
import {
  GraphSource,
  IGraphEdge,
  IGraphNode,
  IGraphNodeDiffCost,
} from "./graph";

export interface IMapping<Node extends IGraphNode> {
  lNode: Node;
  rNode: Node;
  cost: IGraphNodeDiffCost;
}

export interface IMappingWithDiffInfo<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> extends IMapping<Node> {
  diffNodeId: string;
  overrideEdges: Array<{
    fromGraph: GraphSource;
    edge: Edge;
    sourceDiffNodeId?: string;
    targetDiffNodeId?: string;
  }>;
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
