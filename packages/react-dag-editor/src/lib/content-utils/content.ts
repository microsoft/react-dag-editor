import { GraphNodeStatus } from "react-dag-editor";
import { ICanvasData } from "../models/canvas";
import { IContentStateUpdate } from "../models/ContentState";
import { EdgeModel } from "../models/edge";
import { ICanvasNode, INodeModel, NodeModel } from "../models/node";
import { IExistNodeIds, uniqueId } from "../utils/uniqueId";
import { EdgesMapMutator } from "./edges-map-mutator";

export interface IInsertFragmentOptions {
  alwaysRegenerateId?: boolean;
  generateId?: typeof uniqueId;
  selectInsertedNodes?: boolean;
}

const getId =
  (
    exists: IExistNodeIds,
    alwaysRegenerateId: boolean,
    generateId: typeof uniqueId
  ) =>
  (item: { id: string }) => {
    if (alwaysRegenerateId || exists.has(item.id)) {
      return generateId(exists);
    }
    return item.id;
  };

export const insertFragment =
  (
    source: ICanvasData,
    options: IInsertFragmentOptions = {}
  ): IContentStateUpdate =>
  (target) => {
    const {
      alwaysRegenerateId = true,
      generateId = uniqueId,
      selectInsertedNodes = false,
    } = options;

    const nodes = target.nodes.mutate();
    const edges = target.edges.mutate();
    const nodeIdMap = new Map<string, string>();

    const getNodeId = getId(nodes, alwaysRegenerateId, generateId);
    const getEdgeId = getId(edges, alwaysRegenerateId, generateId);

    const nodeStatus = selectInsertedNodes
      ? GraphNodeStatus.Selected
      : GraphNodeStatus.Default;
    const selectedNodes = new Set<string>();

    let head = target.firstNode;
    let tail = target.lastNode;

    if (source.nodes.length) {
      let node = source.nodes[0];
      let nodeId = getNodeId(node);
      nodeIdMap.set(node.id, nodeId);
      let next: ICanvasNode | INodeModel;
      if (!head) {
        head = nodeId;
      }
      const insertNode = (
        node: ICanvasNode | INodeModel,
        next: string | undefined
      ) => {
        nodes.set(
          node.id,
          NodeModel.fromJSON({
            ...node,
            id: nodeId,
            prev: tail,
            status: nodeStatus,
            next,
          })
        );
        if (selectInsertedNodes) {
          selectedNodes.add(node.id);
        }
      };
      for (let i = 0; i < source.nodes.length - 1; i += 1) {
        next = source.nodes[i + 1];
        const nextId = getNodeId(next);
        nodeIdMap.set(next.id, nextId);
        insertNode(node, nextId);
        node = next;
        tail = nodeId;
        nodeId = nextId;
      }
      insertNode(node, undefined);
    }

    const edgesBySource = new EdgesMapMutator(target.edgesBySource);
    const edgesByTarget = new EdgesMapMutator(target.edgesByTarget);
    source.edges.forEach((edge) => {
      const sourceNodeId = nodeIdMap.get(edge.source);
      const targetNodeId = nodeIdMap.get(edge.target);
      if (!sourceNodeId || !targetNodeId) {
        return;
      }
      const edgeId = getEdgeId(edge);
      edges.set(
        edgeId,
        EdgeModel.fromJSON({
          ...edge,
          id: edgeId,
          source: sourceNodeId,
          target: targetNodeId,
        })
      );
      edgesBySource.addEdge(edgeId, sourceNodeId, edge.sourcePortId);
      edgesByTarget.addEdge(edgeId, targetNodeId, edge.targetPortId);
    });

    return {
      nodes: nodes.finish(),
      edges: edges.finish(),
      firstNode: head,
      lastNode: tail,
      edgesBySource: edgesBySource.finish(),
      edgesByTarget: edgesByTarget.finish(),
      selectedNodes,
    };
  };
