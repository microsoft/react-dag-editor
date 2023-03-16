export enum BipartiteGraphType {
  A = "A",
  B = "B",
}

export interface IBipartiteGraphNodeDiffCost {
  /**
   * Total diff cost of the two nodes linked by the edge.
   *
   * !!!Notice that the `total` may not equal with the `propertyDiff` + `structureDiff` since there
   * may be other type of cost.
   */
  total: number;
  /**
   * Diff cost of the properties of the two nodes linked by the edge.
   */
  property: number;
  /**
   * Diff cost of the structure of the two nodes linked by the edge.
   */
  structure: number;
}

export interface IBipartiteGraphNode {}

export interface IMapping<Node extends IBipartiteGraphNode> {
  leftNode: Node;
  rightNode: Node;
  cost: IBipartiteGraphNodeDiffCost;
}
