import * as toposort from "toposort";
import { ICanvasData, ICanvasNode } from "../../Graph.interface";

export const getTopoSortingNodes = (canvasData: ICanvasData): ICanvasNode[] => {
  const { edges, nodes } = canvasData;
  if (!nodes.length) {
    return [];
  }
  if (!edges.length) {
    return [...nodes];
  }

  const edgesForTopo = edges.map(
    edge => [edge.source, edge.target] as [string, string | undefined]
  );
  const nodesForTopo = nodes.map(node => node.id);

  const orderOfNodeIds = toposort.array(nodesForTopo, edgesForTopo);

  const newNodes: ICanvasNode[] = [];
  orderOfNodeIds.map((id: string) => {
    const node = nodes.find(it => it.id === id);
    if (node) {
      newNodes.push(node);
    }
  });

  return newNodes;
};
