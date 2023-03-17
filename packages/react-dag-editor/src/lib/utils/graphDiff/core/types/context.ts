import {
  GraphSource,
  IGraph,
  IGraphEdge,
  IGraphNode,
  IGraphNodeDiffCost,
  IGraphNodeWithStructure,
} from "./graph";

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

export interface IGraphDIffEnums {
  ABOnlyCostThreshold: number;
  PropertyDiffCostRate: number;
  StructureDiffCostRate: number;
}

export interface IGraphDiffMethods<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  areSameNodes(lNode: Node, rNode: Node): IGraphNodeDiffResult;

  buildCandidateMapping(
    lGraph: IGraph<Node, Edge>,
    rGraph: IGraph<Node, Edge>
  ): IMapping<Node>[];

  calcStructureDiffCost(lNode: Node, rNode: Node): number;

  calcPropertyDiffCost(lNode: Node, rNode: Node): number;

  getGraphNodeWithStructure(
    nodeId: string,
    fromGraph: GraphSource
  ): IGraphNodeWithStructure<Node, Edge> | undefined;
}

export interface IGraphDiffContext<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> extends IGraphDIffEnums,
    IGraphDiffMethods<Node, Edge> {}
