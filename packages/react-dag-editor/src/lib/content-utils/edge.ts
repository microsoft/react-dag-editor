import type {
  IContentStateApplicable,
  IContentStateUpdate,
} from "../models/ContentState";
import type { EdgeModel } from "../models/edge";
import { EdgesMapMutator } from "./edges-map-mutator";

export const getEdgesBySource =
  (
    nodeId: string,
    portId: string
  ): IContentStateApplicable<ReadonlySet<string> | undefined> =>
  (content) => {
    return content.edgesBySource.get(nodeId)?.get(portId);
  };

export const getEdgesByTarget =
  (
    nodeId: string,
    portId: string
  ): IContentStateApplicable<ReadonlySet<string> | undefined> =>
  (content) => {
    return content.edgesByTarget.get(nodeId)?.get(portId);
  };

export const isEdgeExist =
  (
    source: string,
    sourcePortId: string,
    target: string,
    targetPortId: string
  ): IContentStateApplicable<boolean> =>
  (content) => {
    const sources = content.apply(getEdgesBySource(source, sourcePortId));
    const targets = content.apply(getEdgesByTarget(target, targetPortId));
    if (!sources || !targets) {
      return false;
    }
    let exist = false;
    sources.forEach((id) => {
      if (targets.has(id)) {
        exist = true;
      }
    });
    return exist;
  };

export const insertEdges =
  (edges: EdgeModel[]): IContentStateUpdate =>
  (content) => {
    const nextNodes = content.nodes.mutate();
    const nextEdges = content.edges.mutate();
    const edgesBySource = new EdgesMapMutator(content.edgesBySource);
    const edgesByTarget = new EdgesMapMutator(content.edgesByTarget);
    edges.forEach((edge) => {
      if (
        isEdgeExist(
          edge.source,
          edge.sourcePortId,
          edge.target,
          edge.targetPortId
        ) ||
        !content.nodes.has(edge.source) ||
        !content.nodes.has(edge.target)
      ) {
        return;
      }
      edgesBySource.addEdge(edge.id, edge.source, edge.sourcePortId);
      edgesByTarget.addEdge(edge.id, edge.target, edge.targetPortId);
      nextNodes
        .update(edge.source, (node) => node.invalidCache())
        .update(edge.target, (node) => node.invalidCache());
      nextEdges.set(edge.id, edge);
    });
    return {
      nodes: nextNodes.finish(),
      edges: nextEdges.finish(),
      edgesBySource: edgesBySource.finish(),
      edgesByTarget: edgesByTarget.finish(),
    };
  };

export const deleteEdges =
  (edgeIds: string[]): IContentStateUpdate =>
  (content) => {
    const nextNodes = content.nodes.mutate();
    const nextEdges = content.edges.mutate();
    const edgesBySource = new EdgesMapMutator(content.edgesBySource);
    const edgesByTarget = new EdgesMapMutator(content.edgesByTarget);
    edgeIds.forEach((edgeId) => {
      const edge = nextEdges.get(edgeId);
      if (!edge) {
        return;
      }
      edgesBySource.deleteEdge(edge.id, edge.source, edge.sourcePortId);
      edgesByTarget.deleteEdge(edge.id, edge.target, edge.targetPortId);
      nextNodes
        .update(edge.source, (node) => node.invalidCache())
        .update(edge.target, (node) => node.invalidCache());
    });
    return {
      nodes: nextNodes.finish(),
      edges: nextEdges.finish(),
      edgesBySource: edgesBySource.finish(),
      edgesByTarget: edgesByTarget.finish(),
    };
  };
