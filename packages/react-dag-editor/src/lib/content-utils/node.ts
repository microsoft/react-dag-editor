import {
  IContentStateComputed,
  IContentStateUpdate,
  INodeUpdate,
  markEdgeDirty,
  NodeModel,
} from "react-dag-editor";
import { ContentState } from "../models/ContentState";

export const getFirstNode =
  (): IContentStateComputed<NodeModel | undefined> =>
  (content: ContentState) => {
    if (!content.firstNode) {
      return undefined;
    }
    return content.nodes.get(content.firstNode);
  };

export const updateNode =
  (id: string, f: INodeUpdate): IContentStateUpdate =>
  (content) => {
    const nodes = content.nodes.update(id, (node) => node.pipe([f]));
    if (nodes === content.nodes) {
      return content;
    }
    const edges = content.edges.mutate();
    content.edgesBySource.get(id)?.forEach((edgeIds) => {
      edgeIds.forEach((edgeId) => {
        markEdgeDirty(edges, edgeId);
      });
    });
    content.edgesByTarget.get(id)?.forEach((edgeIds) => {
      edgeIds.forEach((edgeId) => {
        markEdgeDirty(edges, edgeId);
      });
    });
    return {
      nodes,
      edges: edges.finish(),
    };
  };

export const insertNode =
  (node: NodeModel): IContentStateUpdate =>
  (content) => {
    const nodes = content.nodes.mutate().set(
      node.id,
      node.merge({
        prev: content.lastNode,
      })
    );
    if (content.lastNode && !content.nodes.has(node.id)) {
      nodes.update(content.lastNode, (tail) =>
        tail.merge({
          next: node.id,
        })
      );
    }
    return {
      nodes: nodes.finish(),
      head: content.nodes.size === 0 ? node.id : content.firstNode,
      tail: node.id,
    };
  };
