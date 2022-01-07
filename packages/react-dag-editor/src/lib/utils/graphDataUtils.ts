import type * as React from "react";
import { lift } from "record-class";
import type { HashMapBuilder } from "../collections";
import { MouseEventButton } from "../common/constants";
import type { ICanvasData } from "../models/canvas";
import type {
  IGetConnectableParams,
  IGraphConfig,
} from "../models/config/types";
import type { ICanvasEdge } from "../models/edge";
import type { EdgeModel, IEdgeModel } from "../models/EdgeModel";
import type { IViewport } from "../models/geometry";
import type { GraphModel } from "../models/GraphModel";
import type { ICanvasNode } from "../models/node";
import type { INodeModel, NodeModel } from "../models/NodeModel";
import type { ICanvasPort } from "../models/port";
import type { IPortModel, PortModel } from "../models/PortModel";
import {
  GraphEdgeStatus,
  GraphNodeStatus,
  GraphPortStatus,
  isNodeEditing,
  isSelected,
  liftStatus,
  updateStatus,
} from "../models/status";
import { getPortPositionByPortId } from "./getPortPosition";
import { identical } from "./identical";
import { checkIsMultiSelect } from "./keyboard";
import * as Bitset from "./bitset";
import { getRealPointFromClientPoint } from "./transformMatrix";

export type TDataPatch = (data: GraphModel) => GraphModel;

/**
 * shallow copy to mark edge dirty, in order to trigger a re-render
 *
 * @param edges
 * @param id
 * @param edges
 * @param id
 */
export function markEdgeDirty(
  edges: HashMapBuilder<string, EdgeModel>,
  id: string
): void {
  edges.update(id, (edge) => edge.clone());
}

export interface IGetNearestConnectablePortParams
  extends Omit<IGetConnectableParams, "model"> {
  clientX: number;
  clientY: number;
  graphConfig: IGraphConfig;
  data: GraphModel;
  viewport: Required<IViewport>;
}

export const getNearestConnectablePort = (
  params: IGetNearestConnectablePortParams
): PortModel | undefined => {
  const { parentNode: node, clientX, clientY, graphConfig, viewport } = params;
  let minDistance = Infinity;
  let nearestPort: PortModel | undefined;

  if (!node.ports) {
    return undefined;
  }
  const point = getRealPointFromClientPoint(clientX, clientY, viewport);
  node.ports.forEach((port) => {
    if (
      isConnectable(graphConfig, {
        ...params,
        model: port,
      })
    ) {
      const portPos = getPortPositionByPortId(node, port.id, graphConfig);
      if (!portPos) {
        return;
      }
      const diffX = point.x - portPos.x;
      const diffY = point.y - portPos.y;
      const distance = diffX * diffX + diffY * diffY;
      if (distance < minDistance) {
        minDistance = distance;
        nearestPort = port;
      }
    }
  });

  return nearestPort;
};

export const isConnectable = (
  graphConfig: IGraphConfig,
  params: IGetConnectableParams
) => {
  const portConfig = graphConfig.getPortConfigByName(params.model.shape);
  return portConfig ? portConfig.getIsConnectable(params) : false;
};

/**
 * @param node
 */
export function resetNodePortsState(node: NodeModel): NodeModel {
  return node.updatePorts(
    updateStatus(Bitset.replace(GraphPortStatus.Default))
  );
}

export const filterSelectedItems = (data: GraphModel): ICanvasData => {
  const nodes = new Map<string, ICanvasNode>();
  const edges: Array<ICanvasEdge> = [];

  data.nodes.forEach((node) => {
    const json = node.toJSON();
    if (isSelected(json)) {
      nodes.set(json.id, json);
    }
  });

  data.edges.forEach((node) => {
    if (
      isSelected(node) ||
      (nodes.has(node.source) && nodes.has(node.target))
    ) {
      edges.push(node.toJSON());
    }
  });

  return {
    nodes: Array.from(nodes.values()),
    edges,
  };
};

interface IPortNeighbor {
  nodeId: string;
  portId: string;
}

export const getNeighborPorts = (
  data: GraphModel,
  nodeId: string,
  portId: string
): IPortNeighbor[] => {
  const neighbors = [] as IPortNeighbor[];
  const edgesBySource = data.getEdgesBySource(nodeId, portId);
  const edgesByTarget = data.getEdgesByTarget(nodeId, portId);
  edgesBySource?.forEach((edgeId) => {
    const edge = data.edges.get(edgeId);
    if (edge) {
      neighbors.push({
        nodeId: edge.target,
        portId: edge.targetPortId,
      });
    }
  });
  edgesByTarget?.forEach((edgeId) => {
    const edge = data.edges.get(edgeId);
    if (edge) {
      neighbors.push({
        nodeId: edge.source,
        portId: edge.sourcePortId,
      });
    }
  });
  return neighbors;
};

export const unSelectAllEntity = (): TDataPatch => {
  return (data) =>
    data
      .mapNodes((n) =>
        n.pipe((curNode) => {
          const nextNode = {
            ...curNode,
            ports: curNode.ports?.map(
              lift(liftStatus(Bitset.replace(GraphPortStatus.Default)))
            ),
          };
          return updateStatus(Bitset.replace(GraphNodeStatus.Default))(
            nextNode
          );
        })
      )
      .mapEdges((e) =>
        e.pipe(updateStatus(Bitset.replace(GraphEdgeStatus.Default)))
      );
};

export const nodeSelection = (
  e: MouseEvent | React.MouseEvent,
  target: ICanvasNode | INodeModel
): ((data: GraphModel) => GraphModel) => {
  if (isNodeEditing(target)) {
    return identical;
  }

  const isMultiSelect = checkIsMultiSelect(e);

  if (isSelected(target) && !isMultiSelect) {
    return identical;
  }

  return (data) => {
    const predicate: (node: NodeModel) => boolean = isMultiSelect
      ? (node) => {
          if (node.id !== target.id) {
            return isSelected(node);
          } else if (e.button === MouseEventButton.Secondary) {
            return true;
          } else {
            // use target.state here which is node's original state before onNodeMouseDown
            return !isSelected(target);
          }
        }
      : (node) => node.id === target.id;
    return data.selectNodes(predicate, target.id);
  };
};

export const getNodeAutomationId = (node: ICanvasNode | INodeModel): string => {
  return `node-container-${node.name ?? "unnamed"}-${node.id}`;
};

export const getPortAutomationId = (
  port: ICanvasPort | IPortModel,
  parentNode: ICanvasNode | INodeModel
): string => {
  return `port-${parentNode.name}-${parentNode.id}-${port.name}-${port.id}`;
};

export const getNodeUid = (
  graphId: string,
  node: ICanvasNode | INodeModel
): string => {
  return `node:${graphId}:${node.id}`;
};

export const getPortUid = (
  graphId: string,
  node: ICanvasNode | INodeModel,
  port: ICanvasPort | IPortModel
): string => {
  return `port:${graphId}:${node.id}:${port.id}`;
};

export const getEdgeUid = (
  graphId: string,
  edge: ICanvasEdge | IEdgeModel
): string => {
  return `edge:${graphId}:${edge.id}`;
};
