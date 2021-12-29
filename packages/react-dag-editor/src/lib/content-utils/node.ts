import { lift } from "record-class";
import {
  ContentState,
  IContentStateApplicable,
  IContentStateUpdate,
} from "../models/ContentState";
import { INodeUpdate, NodeModel } from "../models/node";
import {
  GraphEdgeStatus,
  GraphNodeStatus,
  GraphPortStatus,
  isSelected,
  resetConnectStatus,
  liftStatus,
} from "../models/status";
import { liftPorts } from "../node-utils";
import { markEdgeDirty } from "../utils";
import * as Bitset from "../utils/bitset";

export const getFirstNode =
  (): IContentStateApplicable<NodeModel | undefined> =>
  (content: ContentState) => {
    if (!content.firstNode) {
      return undefined;
    }
    return content.nodes.get(content.firstNode);
  };

export const updateNode =
  (id: string, f: INodeUpdate): IContentStateUpdate =>
  (content) => {
    const nodes = content.nodes.update(id, lift(f));
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

export const selectNodes =
  (
    predicate: (node: NodeModel) => boolean,
    topNode?: string
  ): IContentStateUpdate =>
  (content) => {
    const selected = new Set<string>();
    const nodes = content.nodes
      .map((node) => {
        const isNodeSelected = predicate(node);
        if (isNodeSelected) {
          selected.add(node.id);
        }
        return node.pipe(
          liftPorts(liftStatus(Bitset.replace(GraphPortStatus.Default))),
          liftStatus(
            resetConnectStatus(
              isNodeSelected
                ? GraphNodeStatus.Selected
                : GraphNodeStatus.UnconnectedToSelected
            )
          )
        );
      })
      .mutate();

    if (selected.size === 0) {
      content.nodes.forEach((n) =>
        nodes.update(n.id, (it) =>
          it.pipe(liftStatus(Bitset.replace(GraphNodeStatus.Default)))
        )
      );
    } else if (topNode) {
      const n = nodes.get(topNode);
      if (n) {
        nodes.delete(topNode);
        nodes.set(n.id, n);
      }
    }

    const setConnected = (id: string) => {
      nodes.update(id, (node) =>
        node.pipe(
          liftStatus(
            Bitset.replace(
              isSelected(node)
                ? GraphNodeStatus.Selected
                : GraphNodeStatus.ConnectedToSelected
            )
          )
        )
      );
    };
    const edges = selected.size
      ? content.edges.map((edge) => {
          let state = GraphEdgeStatus.UnconnectedToSelected;
          if (selected.has(edge.source)) {
            setConnected(edge.target);
            state = GraphEdgeStatus.ConnectedToSelected;
          }
          if (selected.has(edge.target)) {
            setConnected(edge.source);
            state = GraphEdgeStatus.ConnectedToSelected;
          }
          return edge.pipe(liftStatus(Bitset.replace(state)));
        })
      : content.edges.map((edge) =>
          edge.pipe(liftStatus(Bitset.replace(GraphEdgeStatus.Default)))
        );
    return {
      nodes: nodes.finish(),
      edges,
      selectedNodes: selected,
    };
  };
