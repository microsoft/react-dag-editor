import { IGraphEdge, IGraphNode } from "./graph";

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

export interface IDiffGraphEdge<Edge extends IGraphEdge> {
  id: number; // DiffGraph edge id.
  diffType: GraphEdgeDiffType;
  lDiffNodeId: string;
  rDiffNodeId: string;
  lEdge: Edge | undefined; // Edge from GraphSource.A
  rEdge: Edge | undefined; // Edge from GraphSource.B
}
