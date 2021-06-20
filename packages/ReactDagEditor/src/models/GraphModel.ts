import {
  GraphEdgeState,
  GraphNodeState,
  GraphPortState,
  ICanvasData,
  ICanvasEdge,
  ICanvasGroup,
  ICanvasNode,
  ICanvasPort
} from "../Graph.interface";
import { HashMap, HashMapBuilder, OrderedMap } from "../collections";

import { markEdgeDirty } from "../utils/graphDataUtils";
import { preventSpread } from "../utils/preventSpread";
import { hasState, isSelected, resetConnectState, resetState, updateState } from "../utils/state";
import { EdgeModel } from "./EdgeModel";
import { NodeModel } from "./NodeModel";

export interface IDeleteItemPredicates<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  node?(node: ICanvasNode<NodeData, PortData>): boolean;
  edge?(edge: ICanvasEdge<EdgeData>): boolean;
}

type EdgesByPort = HashMap<string, ReadonlyMap<string, ReadonlySet<string>>>;
type EdgesByPortMutable = HashMapBuilder<string, Map<string, Set<string>>>;

/**
 * @internal
 */
export interface INodeGeometryDelta {
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
}

/**
 * Things preferred to be implemented as methods here:
 * * widely shared functions, eg. `updateNode`
 * * including multiple operations that must happen atomically
 * * improve performance by internal mutability
 */
export class GraphModel<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  public readonly nodes: OrderedMap<string, NodeModel<NodeData, PortData>>;
  public readonly edges: HashMap<string, EdgeModel<EdgeData>>;
  public readonly groups: ICanvasGroup[];
  public readonly head: string | undefined;
  public readonly tail: string | undefined;
  public readonly edgesBySource: EdgesByPort;
  public readonly edgesByTarget: EdgesByPort;

  private constructor(
    nodes: OrderedMap<string, NodeModel<NodeData, PortData>>,
    edges: HashMap<string, EdgeModel<EdgeData>>,
    groups: ICanvasGroup[],
    head: string | undefined,
    tail: string | undefined,
    edgesBySource: EdgesByPort,
    edgesByTarget: EdgesByPort
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.groups = groups;
    this.head = head;
    this.tail = tail;
    this.edgesBySource = edgesBySource;
    this.edgesByTarget = edgesByTarget;
    preventSpread(this);
  }

  public static empty<N, E, P>(): GraphModel<N, E, P> {
    return new GraphModel(
      OrderedMap.empty(),
      HashMap.empty(),
      [],
      undefined,
      undefined,
      HashMap.empty(),
      HashMap.empty()
    );
  }

  public static fromJSON<N, E, P>(init: ICanvasData<N, E, P>): GraphModel<N, E, P> {
    const nodes = OrderedMap.empty<string, NodeModel<N, P>>().mutate();
    const edges = HashMap.empty<string, EdgeModel<E>>().mutate();

    let head: string | undefined;
    let tail: string | undefined;

    if (init.nodes.length === 0) {
      head = undefined;
      tail = undefined;
    } else if (init.nodes.length === 1) {
      const node = init.nodes[0];
      nodes.set(node.id, NodeModel.fromJSON(node, undefined, undefined));
      head = node.id;
      tail = node.id;
    } else {
      const first = init.nodes[0];
      const second = init.nodes[1];
      const last = init.nodes[init.nodes.length - 1];
      head = first.id;
      tail = last.id;
      nodes.set(first.id, NodeModel.fromJSON(first, undefined, second.id));
      let prev = init.nodes[0];
      if (init.nodes.length > 2) {
        for (let i = 1; i < init.nodes.length - 1; i += 1) {
          const node = init.nodes[i];
          const next = init.nodes[i + 1];
          nodes.set(node.id, NodeModel.fromJSON(node, prev.id, next.id));
          prev = node;
        }
      }
      nodes.set(last.id, NodeModel.fromJSON(last, prev.id, undefined));
    }

    const edgesBySource = HashMapBuilder.empty<string, Map<string, Set<string>>>();
    const edgesByTarget = HashMapBuilder.empty<string, Map<string, Set<string>>>();
    for (const edge of init.edges) {
      edges.set(edge.id, EdgeModel.fromJSON(edge));
      setEdgeByPortMutable(edgesBySource, edge.id, edge.source, edge.sourcePortId);
      setEdgeByPortMutable(edgesByTarget, edge.id, edge.target, edge.targetPortId);
    }

    return new GraphModel(
      nodes.finish(),
      edges.finish(),
      init.groups ?? [],
      head,
      tail,
      edgesBySource.finish(),
      edgesByTarget.finish()
    );
  }

  public getNavigationFirstNode(): NodeModel<NodeData, PortData> | undefined {
    if (this.head === undefined) {
      return undefined;
    }
    return this.nodes.get(this.head);
  }

  public updateNode(
    id: string,
    f: (node: ICanvasNode<NodeData, PortData>) => ICanvasNode<NodeData, PortData>
  ): GraphModel<NodeData, EdgeData, PortData> {
    const nodes = this.nodes.update(id, node => node.update(f));
    if (nodes === this.nodes) {
      return this;
    }

    const edges = this.edges.mutate();
    this.edgesBySource.get(id)?.forEach(edgeIds => {
      edgeIds.forEach(edgeId => {
        markEdgeDirty(edges, edgeId);
      });
    });
    this.edgesByTarget.get(id)?.forEach(edgeIds => {
      edgeIds.forEach(edgeId => {
        markEdgeDirty(edges, edgeId);
      });
    });
    return new GraphModel(
      nodes,
      edges.finish(),
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public updateNodeData(id: string, f: (data: NodeData) => NodeData): GraphModel<NodeData, EdgeData, PortData> {
    return new GraphModel(
      this.nodes.update(id, node => node.updateData(f)),
      this.edges,
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public updatePort(
    nodeId: string,
    portId: string,
    f: (port: ICanvasPort<PortData>) => ICanvasPort<PortData>
  ): GraphModel<NodeData, EdgeData, PortData> {
    const nodes = this.nodes.update(nodeId, node => node.updatePorts(port => (port.id === portId ? f(port) : port)));
    return new GraphModel(nodes, this.edges, this.groups, this.head, this.tail, this.edgesBySource, this.edgesByTarget);
  }

  public insertNode(node: ICanvasNode<NodeData, PortData>): GraphModel<NodeData, EdgeData, PortData> {
    const nodes = this.nodes.mutate().set(node.id, NodeModel.fromJSON(node, this.tail, undefined));
    if (this.tail && !this.nodes.has(node.id)) {
      nodes.update(this.tail, tail =>
        tail.link({
          next: node.id
        })
      );
    }
    return new GraphModel(
      nodes.finish(),
      this.edges,
      this.groups,
      this.nodes.size === 0 ? node.id : this.head,
      node.id,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public deleteItems(
    predicate: IDeleteItemPredicates<NodeData, EdgeData, PortData>
  ): GraphModel<NodeData, EdgeData, PortData> {
    const deleted = new Set<string>();
    const nodes = this.nodes.mutate();
    let first = this.head === undefined ? undefined : this.nodes.get(this.head);
    let node = first;
    let prev: NodeModel<NodeData, PortData> | undefined;
    const edgesBySource = this.edgesBySource.mutate();
    const edgesByTarget = this.edgesByTarget.mutate();
    while (node !== undefined) {
      const next = node.next ? this.nodes.get(node.next) : undefined;
      if (!predicate.node?.(node.inner)) {
        nodes.delete(node.id);
        edgesBySource.delete(node.id);
        edgesByTarget.delete(node.id);
        deleted.add(node.id);
        if (prev) {
          nodes.update(prev.id, prevNode => prevNode.link({ next: node?.next }));
        }
        if (next) {
          nodes.update(next.id, nextNode => nextNode.link({ prev: prev?.id }));
        }
        if (node === first) {
          first = next;
        }
      } else {
        nodes.update(node.id, current =>
          current.link({ prev: prev?.id }).update(n => {
            if (hasState(GraphNodeState.editing)(n.state)) {
              return n;
            }
            return {
              ...n,
              state: GraphNodeState.default
            };
          })
        );
        prev = node;
      }
      node = next;
    }
    const edges = this.edges.mutate();
    this.edges.forEach(edge => {
      if (!deleted.has(edge.source) && !deleted.has(edge.target) && (predicate.edge?.(edge) ?? true)) {
        edges.update(edge.id, e => e.update(updateState(resetState(GraphEdgeState.default))));
      } else {
        edges.delete(edge.id);
        deleteEdgeByPort(edgesBySource, edge.id, edge.source, edge.sourcePortId);
        deleteEdgeByPort(edgesByTarget, edge.id, edge.target, edge.targetPortId);
      }
    });

    return new GraphModel(
      nodes.finish(),
      edges.finish(),
      this.groups,
      first?.id,
      prev?.id,
      edgesBySource.finish(),
      edgesByTarget.finish()
    );
  }

  public insertEdge(edge: ICanvasEdge<EdgeData>): GraphModel<NodeData, EdgeData, PortData> {
    if (
      this.isEdgeExist(edge.source, edge.sourcePortId, edge.target, edge.targetPortId) ||
      !this.nodes.has(edge.source) ||
      !this.nodes.has(edge.target)
    ) {
      return this;
    }
    const edgesBySource = setEdgeByPort(this.edgesBySource, edge.id, edge.source, edge.sourcePortId);
    const edgesByTarget = setEdgeByPort(this.edgesByTarget, edge.id, edge.target, edge.targetPortId);
    return new GraphModel(
      this.nodes.update(edge.source, node => node.invalidCache()).update(edge.target, node => node.invalidCache()),
      this.edges.set(edge.id, EdgeModel.fromJSON(edge)).map(e => e.updateState(resetState(GraphEdgeState.default))),
      this.groups,
      this.head,
      this.tail,
      edgesBySource,
      edgesByTarget
    );
  }

  public updateEdge(
    id: string,
    f: (edge: ICanvasEdge<EdgeData>) => ICanvasEdge<EdgeData>
  ): GraphModel<NodeData, EdgeData, PortData> {
    return new GraphModel(
      this.nodes,
      this.edges.update(id, e => e.update(f)),
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public deleteEdge(id: string): GraphModel<NodeData, EdgeData, PortData> {
    const edge = this.edges.get(id);
    if (!edge) {
      return this;
    }
    return new GraphModel(
      this.nodes,
      this.edges.delete(id),
      this.groups,
      this.head,
      this.tail,
      deleteEdgeByPort(this.edgesBySource, edge.id, edge.source, edge.sourcePortId),
      deleteEdgeByPort(this.edgesByTarget, edge.id, edge.target, edge.targetPortId)
    );
  }

  /**
   * @internal
   */
  public updateNodesPositionAndSize(dummies: readonly ICanvasNode[]): GraphModel<NodeData, EdgeData, PortData> {
    const updates = new Set<string>();
    const nodes = this.nodes.mutate();
    const edges = this.edges.mutate();
    dummies.forEach(dummy => {
      updates.add(dummy.id);
      nodes.update(dummy.id, node => node.updatePositionAndSize(dummy));
      this.edgesBySource.get(dummy.id)?.forEach(ids => {
        ids.forEach(id => {
          markEdgeDirty(edges, id);
        });
      });
      this.edgesByTarget.get(dummy.id)?.forEach(ids => {
        ids.forEach(id => {
          markEdgeDirty(edges, id);
        });
      });
    });
    return new GraphModel(
      nodes.finish(),
      edges.finish(),
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public mapNodes(
    f: (node: NodeModel<NodeData, PortData>) => NodeModel<NodeData, PortData>
  ): GraphModel<NodeData, EdgeData, PortData> {
    return new GraphModel(
      this.nodes.map(f),
      this.edges,
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public mapEdges(f: (node: EdgeModel<EdgeData>) => EdgeModel<EdgeData>): GraphModel<NodeData, EdgeData, PortData> {
    return new GraphModel(
      this.nodes,
      this.edges.map(f),
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public selectNodes(
    predicate: (node: ICanvasNode<NodeData, PortData>) => boolean,
    topNode?: string
  ): GraphModel<NodeData, EdgeData, PortData> {
    const selected = new Set<string>();
    const nodes = this.nodes
      .map(node => {
        const isNodeSelected = predicate(node.inner);
        if (isNodeSelected) {
          selected.add(node.id);
        }
        return node
          .updatePorts(updateState(resetState(GraphPortState.default)))
          .updateState(resetConnectState(isNodeSelected ? GraphNodeState.selected : GraphNodeState.unconnectedToSelected));
      })
      .mutate();
    if (selected.size === 0) {
      this.nodes.forEach(n => nodes.update(n.id, it => it.updateState(resetState(GraphNodeState.default))));
    } else if (topNode) {
      const n = nodes.get(topNode);
      if (n) {
        nodes.delete(topNode);
        nodes.set(n.id, n);
      }
    }
    const setConnected = (id: string) => {
      nodes.update(id, node =>
        node.update(
          updateState(resetState(isSelected(node) ? GraphNodeState.selected : GraphNodeState.connectedToSelected))
        )
      );
    };
    const edges = selected.size
      ? this.edges.map(edge => {
          let state = GraphEdgeState.unconnectedToSelected;
          if (selected.has(edge.source)) {
            setConnected(edge.target);
            state = GraphEdgeState.connectedToSelected;
          }
          if (selected.has(edge.target)) {
            setConnected(edge.source);
            state = GraphEdgeState.connectedToSelected;
          }
          return edge.update(updateState(resetState(state)));
        })
      : this.edges.map(edge => edge.updateState(resetState(GraphEdgeState.default)));
    return new GraphModel(
      nodes.finish(),
      edges,
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public getEdgesBySource(nodeId: string, portId: string): ReadonlySet<string> | undefined {
    return this.edgesBySource.get(nodeId)?.get(portId);
  }

  public getEdgesByTarget(nodeId: string, portId: string): ReadonlySet<string> | undefined {
    return this.edgesByTarget.get(nodeId)?.get(portId);
  }

  public isPortConnectedAsSource(nodeId: string, portId: string): boolean {
    return (this.getEdgesBySource(nodeId, portId)?.size ?? 0) > 0;
  }

  public isPortConnectedAsTarget(nodeId: string, portId: string): boolean {
    return (this.getEdgesByTarget(nodeId, portId)?.size ?? 0) > 0;
  }

  public shallow(): GraphModel<NodeData, EdgeData, PortData> {
    return new GraphModel(
      this.nodes,
      this.edges,
      this.groups,
      this.head,
      this.tail,
      this.edgesBySource,
      this.edgesByTarget
    );
  }

  public toJSON(): ICanvasData<NodeData, EdgeData, PortData> {
    const nodes: Array<ICanvasNode<NodeData, PortData>> = [];
    let current = this.head && this.nodes.get(this.head);
    while (current) {
      nodes.push(current.inner);
      current = current.next && this.nodes.get(current.next);
    }
    const edges = Array.from(this.edges.values()).map(it => it.inner);
    return {
      nodes,
      edges
    };
  }

  public isEdgeExist(source: string, sourcePortId: string, target: string, targetPortId: string): boolean {
    const sources = this.getEdgesBySource(source, sourcePortId);
    const targets = this.getEdgesByTarget(target, targetPortId);
    if (!sources || !targets) {
      return false;
    }
    let exist = false;
    sources.forEach(id => {
      if (targets.has(id)) {
        exist = true;
      }
    });
    return exist;
  }
}

/**
 * @param edgesByPort
 * @param edgeId
 * @param nodeId
 * @param portId
 */
function setEdgeByPort(edgesByPort: EdgesByPort, edgeId: string, nodeId: string, portId: string): EdgesByPort {
  return edgesByPort.has(nodeId)
    ? edgesByPort.update(nodeId, map => {
        const edges = map.get(portId);
        return new Map(map).set(portId, (edges ? new Set(edges) : new Set<string>()).add(edgeId));
      })
    : edgesByPort.set(nodeId, new Map([[portId, new Set([edgeId])]]));
}

/**
 * @param edgesByPort
 * @param edgeId
 * @param nodeId
 * @param portId
 */
function setEdgeByPortMutable(edgesByPort: EdgesByPortMutable, edgeId: string, nodeId: string, portId: string): void {
  if (edgesByPort.has(nodeId)) {
    edgesByPort.update(nodeId, map => {
      let set = map.get(portId);
      if (!set) {
        set = new Set<string>();
        map.set(portId, set);
      }
      set.add(edgeId);
      return map;
    });
  } else {
    edgesByPort.set(nodeId, new Map([[portId, new Set([edgeId])]]));
  }
}

/**
 * @param edgesByPort
 * @param edgeId
 * @param nodeId
 * @param portId
 */
function deleteEdgeByPort<T extends EdgesByPort | HashMapBuilder<string, ReadonlyMap<string, ReadonlySet<string>>>>(
  edgesByPort: T,
  edgeId: string,
  nodeId: string,
  portId: string
): T {
  if (!edgesByPort.has(nodeId)) {
    return edgesByPort;
  }
  return edgesByPort.update(nodeId, edgeByPortsMap => {
    const edgeIds = edgeByPortsMap.get(portId);
    if (!edgeIds) {
      return edgeByPortsMap;
    }
    const set = new Set(edgeIds);
    set.delete(edgeId);
    return new Map(edgeByPortsMap).set(portId, set);
  }) as T;
}
