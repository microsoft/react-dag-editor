import type * as React from "react";
import type { HashMapBuilder } from "../collections";
import { MouseEventButton } from "../common/constants";
import type { ICanvasData } from "../models/canvas";
import type {
  IGetConnectableParams,
  IGraphConfig,
} from "../models/config/types";
import type { ICanvasEdge } from "../models/edge";
import type { EdgeModel } from "../models/EdgeModel";
import type { IViewport } from "../models/geometry";
import type { GraphModel } from "../models/GraphModel";
import type { ICanvasNode } from "../models/node";
import type { NodeModel } from "../models/NodeModel";
import type { ICanvasPort } from "../models/port";
import {
  GraphEdgeStatus,
  GraphNodeStatus,
  GraphPortStatus,
  isNodeEditing,
  isSelected,
  updateStatus,
} from "../models/status";
import { getPortPositionByPortId } from "./getPortPosition";
import { identical } from "./identical";
import { checkIsMultiSelect } from "./keyboard";
import * as Bitset from "./bitset";
import { getRealPointFromClientPoint } from "./transformMatrix";

export type TDataPatch<NodeData, EdgeData, PortData> = (
  data: GraphModel<NodeData, EdgeData, PortData>
) => GraphModel<NodeData, EdgeData, PortData>;

/**
 * shallow copy to mark edge dirty, in order to trigger a re-render
 *
 * @param edges
 * @param id
 * @param edges
 * @param id
 */
export function markEdgeDirty<T>(
  edges: HashMapBuilder<string, EdgeModel<T>>,
  id: string
): void {
  edges.update(id, (edge) => edge.shallow());
}

export interface IGetNearestConnectablePortParams<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> extends Omit<IGetConnectableParams, "model"> {
  clientX: number;
  clientY: number;
  graphConfig: IGraphConfig;
  data: GraphModel<NodeData, EdgeData, PortData>;
  viewport: Required<IViewport>;
}

export const getNearestConnectablePort = (
  params: IGetNearestConnectablePortParams
): ICanvasPort | undefined => {
  const { parentNode: node, clientX, clientY, graphConfig, viewport } = params;
  let minDistance = Infinity;
  let nearestPort: ICanvasPort | undefined;

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
  const portConfig = graphConfig.getPortConfig(params.model);
  return portConfig ? portConfig.getIsConnectable(params) : false;
};

/**
 * @param node
 */
export function resetNodePortsState<NodeData, PortData>(
  node: NodeModel<NodeData, PortData>
): NodeModel<NodeData, PortData> {
  return node.updatePorts(
    updateStatus(Bitset.replace(GraphPortStatus.Default))
  );
}

export const filterSelectedItems = <NodeData, EdgeData, PortData>(
  data: GraphModel<NodeData, EdgeData, PortData>
): ICanvasData<NodeData, EdgeData, PortData> => {
  const nodes = new Map<string, ICanvasNode<NodeData, PortData>>();
  const edges: Array<ICanvasEdge<EdgeData>> = [];

  data.nodes.forEach((node) => {
    const json = node.toJSON();
    if (isSelected(json)) {
      nodes.set(json.id, json);
    }
  });

  data.edges.forEach(({ inner }) => {
    if (
      isSelected(inner) ||
      (nodes.has(inner.source) && nodes.has(inner.target))
    ) {
      edges.push(inner);
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

export const getNeighborPorts = <NodeData, EdgeData, PortData>(
  data: GraphModel<NodeData, EdgeData, PortData>,
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

export const unSelectAllEntity = <NodeData, EdgeData, PortData>(): TDataPatch<
  NodeData,
  EdgeData,
  PortData
> => {
  return (data) =>
    data
      .mapNodes((n) =>
        n.update(
          (
            curNode: ICanvasNode<NodeData, PortData>
          ): ICanvasNode<NodeData, PortData> => {
            const nextNode: ICanvasNode<NodeData, PortData> = {
              ...curNode,
              ports: curNode.ports?.map(
                updateStatus(Bitset.replace(GraphPortStatus.Default))
              ),
            };
            return updateStatus(Bitset.replace(GraphNodeStatus.Default))(
              nextNode
            );
          }
        )
      )
      .mapEdges((e) =>
        e.update(updateStatus(Bitset.replace(GraphEdgeStatus.Default)))
      );
};

export const nodeSelection = <NodeData, EdgeData, PortData>(
  e: MouseEvent | React.MouseEvent,
  target: ICanvasNode<NodeData, PortData>
): ((
  data: GraphModel<NodeData, EdgeData, PortData>
) => GraphModel<NodeData, EdgeData, PortData>) => {
  if (isNodeEditing(target)) {
    return identical;
  }

  const isMultiSelect = checkIsMultiSelect(e);

  if (isSelected(target) && !isMultiSelect) {
    return identical;
  }

  return (data) => {
    const predicate: (node: ICanvasNode<NodeData, PortData>) => boolean =
      isMultiSelect
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

export const getNodeAutomationId = (node: ICanvasNode): string => {
  return `node-container-${node.name ?? "unnamed"}-${node.id}`;
};

export const getPortAutomationId = (
  port: ICanvasPort,
  parentNode: ICanvasNode
): string => {
  return `port-${parentNode.name}-${parentNode.id}-${port.name}-${port.id}`;
};

export const getNodeUid = (graphId: string, node: ICanvasNode): string => {
  return `node:${graphId}:${node.id}`;
};

export const getPortUid = (
  graphId: string,
  node: ICanvasNode,
  port: ICanvasPort
): string => {
  return `port:${graphId}:${node.id}:${port.id}`;
};

export const getEdgeUid = (graphId: string, edge: ICanvasEdge): string => {
  return `edge:${graphId}:${edge.id}`;
};
