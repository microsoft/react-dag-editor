import { ICanvasData } from "../models/canvas";
import { ICanvasNode } from "../models/node";

/**
 *
 * @param preData previous graph data
 * @param data current graph data
 */

export interface IDiffGraphNode {
  isAdded: boolean;
  nodes: ICanvasNode[];
}

export const diffGraphNode = (
  preData: ICanvasData,
  data: ICanvasData
): IDiffGraphNode => {
  const isAdded = data.nodes.length > preData.nodes.length;

  const larger = isAdded ? data : preData;
  const smaller = isAdded ? preData : data;

  const nodeIdSet = new Set();

  smaller.nodes.forEach(n => nodeIdSet.add(n.id));

  const nodes = larger.nodes.filter(n => !nodeIdSet.has(n.id));

  return { isAdded, nodes };
};
