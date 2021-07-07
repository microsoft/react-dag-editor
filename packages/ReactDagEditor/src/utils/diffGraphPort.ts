import { ICanvasData } from "../models/canvas";
import { ICanvasNode } from "../models/node";
import { ICanvasPort } from "../models/port";

export interface IDiffPort {
  node: ICanvasNode;
  ports: ICanvasPort[];
}

export interface IDiffGraphPort {
  isAdded: boolean;
  diffPorts: IDiffPort[];
}

/**
 * one action can just add ports or remove ports,
 * can not add some ports meanwhile remove some ports
 */

export const diffGraphPort = (preData: ICanvasData, data: ICanvasData): IDiffGraphPort => {
  const prePortIdSet = new Set<string>();
  const preNodes = new Map<string, ICanvasNode>();

  const portIdSet = new Set<string>();
  const nodes = new Map<string, ICanvasNode>();

  const CONNECT = "--CONNECT--";

  preData.nodes.forEach(n => {
    preNodes.set(n.id, n);
    if (n.ports) {
      n.ports.forEach(p => prePortIdSet.add(`${n.id}${CONNECT}${p.id}`));
    }
  });

  data.nodes.forEach(n => {
    nodes.set(n.id, n);
    if (n.ports) {
      n.ports.forEach(p => portIdSet.add(`${n.id}${CONNECT}${p.id}`));
    }
  });

  const isAdded = portIdSet.size > prePortIdSet.size;
  const small = isAdded ? prePortIdSet : portIdSet;
  const large = isAdded ? portIdSet : prePortIdSet;

  const largeNodes = isAdded ? nodes : preNodes;

  const map = new Map<string, IDiffPort>();

  large.forEach(id => {
    if (!small.has(id)) {
      const [nodeId, portId] = id.split(CONNECT);
      const node = largeNodes.get(nodeId);

      if (node && node.ports) {
        if (!map.get(nodeId)) {
          map.set(nodeId, { node, ports: [] });
        }

        const [port] = node.ports.filter(p => p.id === portId);
        map.get(nodeId)?.ports.push(port);
      }
    }
  });

  const diffPorts: IDiffPort[] = Array.from(map.values());
  return { isAdded, diffPorts };
};
