import {
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
  StructureDiffCostRate: number;
}

export interface IGraphDiffMethods<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  areSameNodes(
    lNode: Node,
    rNode: Node,
    lNodesMap: Map<string, IGraphNodeWithStructure<Node, Edge>>,
    rNodesMap: Map<string, IGraphNodeWithStructure<Node, Edge>>
  ): IGraphNodeDiffResult;
}

export interface IGraphDiffContext<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  enums: IGraphDIffEnums;
  methods: IGraphDiffMethods<Node, Edge>;
}
