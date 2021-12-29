import { liftMerge } from "record-class";
import { ICanvasData } from "../models/canvas";
import { IContentStateUpdate } from "../models/ContentState";
import { EdgeModel } from "../models/edge";
import { ICanvasNode, INodeModel, NodeModel } from "../models/node";
import { GraphEdgeStatus, GraphNodeStatus, liftStatus } from "../models/status";
import * as Bitset from "../utils/bitset";
import { IExistNodeIds, uniqueId } from "../utils/uniqueId";
import { Writable } from "../utils/Writable";
import { EdgesMapMutator } from "./edges-map-mutator";
import { getFirstNode } from "./node";

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

    let head = target.head;
    let tail = target.tail;

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
      head: head,
      tail: tail,
      edgesBySource: edgesBySource.finish(),
      edgesByTarget: edgesByTarget.finish(),
      selectedNodes,
    };
  };

export interface IDeleteItemPredicates {
  node?(node: NodeModel): boolean;
  edge?(edge: EdgeModel): boolean;
}

export const deleteItems =
  (predicate: IDeleteItemPredicates): IContentStateUpdate =>
  (content) => {
    const deleted = new Set<string>();
    const nodes = content.nodes.mutate();
    let first = getFirstNode(content);
    let node = first;
    let prev: NodeModel | undefined;
    const edgesBySource = new EdgesMapMutator(content.edgesBySource);
    const edgesByTarget = new EdgesMapMutator(content.edgesByTarget);
    while (node !== undefined) {
      const next = node.next ? content.nodes.get(node.next) : undefined;
      if (!predicate.node?.(node)) {
        nodes.delete(node.id);
        edgesBySource.deleteNode(node.id);
        edgesByTarget.deleteNode(node.id);
        deleted.add(node.id);
        const link: Partial<Writable<INodeModel>> = {};
        if (prev) {
          link.next = node?.next;
        }
        if (next) {
          link.prev = prev?.id;
        }
        nodes.update(node.id, liftMerge(link));
        if (node === first) {
          first = next;
        }
      } else {
        nodes.update(node.id, (current) =>
          current.merge({
            prev: prev?.id,
            status: Bitset.has(GraphNodeStatus.Editing)(current.status)
              ? current.status
              : GraphNodeStatus.Default,
          })
        );
        prev = node;
      }
      node = next;
    }
    const edges = content.edges.mutate();
    content.edges.forEach((edge) => {
      if (
        !deleted.has(edge.source) &&
        !deleted.has(edge.target) &&
        (predicate.edge?.(edge) ?? true)
      ) {
        edges.update(
          edge.id,
          liftMerge(liftStatus(Bitset.replace(GraphEdgeStatus.Default)))
        );
      } else {
        edges.delete(edge.id);
        edgesBySource.deleteEdge(edge.id, edge.source, edge.sourcePortId);
        edgesByTarget.deleteEdge(edge.id, edge.target, edge.targetPortId);
      }
    });
    return {
      nodes: nodes.finish(),
      edges: edges.finish(),
      head: first?.id,
      tail: prev?.id,
      edgesBySource: edgesBySource.finish(),
      edgesByTarget: edgesByTarget.finish(),
    };
  };
