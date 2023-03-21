import { GraphSource, IGraphEdge, IGraphNode } from "./graph";

export enum GraphNodeDiffType {
  equal = "equal",
  AOnly = "AOnly", // A only.
  BOnly = "BOnly", // B only.
  portChanged = "portChanged",
  propertyChanged = "propertyChanged",
}

export enum GraphEdgeDiffType {
  equal = "equal",
  AOnly = "AOnly ", // A only.
  BOnly = "BOnly", // B only.
}

export interface IDiffGraphNode<Node extends IGraphNode> {
  id: number; // DiffGraph node id.
  diffType: GraphNodeDiffType;
  lNode: Node | undefined; // Node from GraphSource.A
  rNode: Node | undefined; // Node from GraphSource.B
}

export interface IDiffGraphEdge<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  id: string; // DiffGraph edge id.
  diffType: GraphEdgeDiffType;
  sourceDiffNode: IDiffGraphNode<Node>;
  targetDiffNode: IDiffGraphNode<Node>;
  lEdge: Edge | undefined; // Edge from GraphSource.A
  rEdge: Edge | undefined; // Edge from GraphSource.B
}

export interface IDiffGraph<Node extends IGraphNode, Edge extends IGraphEdge> {
  diffNodes: IDiffGraphNode<Node>[];
  diffEdges: IDiffGraphEdge<Node, Edge>[];
}

export interface IDiffGraphNodeSearcher<Node extends IGraphNode> {
  diffNodeMap: Map<number, IDiffGraphNode<Node>>;
  lNodeId2diffNodeMap: Map<string, IDiffGraphNode<Node>>;
  rNodeId2diffNodeMap: Map<string, IDiffGraphNode<Node>>;
}

export interface IABOnlyNode<Node extends IGraphNode> {
  fromGraph: GraphSource;
  node: Node;
  active: boolean;
}
