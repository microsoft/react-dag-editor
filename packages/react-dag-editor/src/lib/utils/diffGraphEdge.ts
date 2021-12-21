import { ICanvasData } from "../models/canvas";
import { ICanvasEdge } from "../models/edge";

/**
 *
 * @param preData previous graph data
 * @param data current graph data
 */

export interface IDiffGraphEdge {
  isAdded: boolean;
  edges: ICanvasEdge[];
}

export const diffGraphEdge = (
  preData: ICanvasData,
  data: ICanvasData
): IDiffGraphEdge => {
  const isAdded = data.edges.length > preData.edges.length;

  const larger = isAdded ? data : preData;
  const smaller = isAdded ? preData : data;

  const edgeIdSet = new Set();

  smaller.edges.forEach((n) => edgeIdSet.add(n.id));

  const edges = larger.edges.filter((n) => !edgeIdSet.has(n.id));

  return { isAdded, edges };
};
