import {
  IGraph,
  IGraphEdge,
  IGraphNode,
  IGraphNodeWithStructure,
} from "./graph";

export interface IGraphDIffEnums {
  ABOnlyCostThreshold: number;
  PropertyDiffCostRate: number;
  StructureDiffCostRate: number;
}

export interface IGraphDiffContext<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> extends IGraphDIffEnums {
  readonly lGraph: IGraph<Node, Edge>;
  readonly rGraph: IGraph<Node, Edge>;

  readonly lNodesMap: ReadonlyMap<string, IGraphNodeWithStructure<Node, Edge>>;
  readonly rNodesMap: ReadonlyMap<string, IGraphNodeWithStructure<Node, Edge>>;
}
