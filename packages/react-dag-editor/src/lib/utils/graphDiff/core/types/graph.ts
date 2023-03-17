export enum GraphSource {
  A = "A",
  B = "B",
}

export interface IGraphNode {
  id: string;
  hash: string | undefined; // For quickly comparing.
}

export interface IGraphEdge {}

export interface IGraph<Node extends IGraphNode, Edge extends IGraphEdge> {
  nodes: Node[];
  edges: Edge[];
}

export interface IGraphNodeOutgoingEdge<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  portId: string;
  targetNode: Node;
  targetPortId: string;
  originalEdge: Edge;
}

export interface IGraphNodeWithStructure<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  node: Node;
  inEdges: IGraphNodeOutgoingEdge<Node, Edge>[];
  outEdges: IGraphNodeOutgoingEdge<Node, Edge>[];
}

export interface IGraphNodeDiffCost {
  /**
   * Total diff cost of the two nodes linked by the edge.
   *
   * !!!NOTICE
   * There may be other type of cost, so the value of `.total` may not equal to
   * the sum of `.property` and `.structure`.
   */
  total: number;
  /**
   * Diff cost of the properties between the two nodes linked by the edge.
   */
  property: number;
  /**
   * Diff cost of the structure between the two nodes linked by the edge.
   */
  structure: number;
}
