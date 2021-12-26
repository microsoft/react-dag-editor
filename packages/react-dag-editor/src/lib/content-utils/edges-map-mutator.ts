import { EdgesByPort } from "react-dag-editor";
import { HashMap, HashMapBuilder } from "../collections";

export class EdgesMapMutator {
  private result: HashMapBuilder<string, Map<string, Set<string>>>;
  private source: HashMap<string, ReadonlyMap<string, ReadonlySet<string>>>;

  constructor(edgesByPort: EdgesByPort) {
    this.result = HashMap.empty<string, Map<string, Set<string>>>().mutate();
    this.source = edgesByPort;
  }

  public addEdge(
    edgeId: string,
    nodeId: string,
    portId: string
  ): EdgesMapMutator {
    const edges = this.getEdgesByPort(nodeId, portId);
    edges.add(edgeId);
    return this;
  }

  public deleteEdge(
    edgeId: string,
    nodeId: string,
    portId: string
  ): EdgesMapMutator {
    const edges = this.getEdgesByPort(nodeId, portId);
    edges.delete(edgeId);
    return this;
  }

  public finish(): HashMap<string, ReadonlyMap<string, ReadonlySet<string>>> {
    this.source.forEach((ports, nodeId) => {
      ports.forEach((prevEdges, portId) => {
        this.getEdgesByPort(nodeId, portId);
      });
    });
    const result = this.result.finish();
    this.result = HashMap.empty<string, Map<string, Set<string>>>().mutate();
    return result;
  }

  private getEdgesByPort(nodeId: string, portId: string): Set<string> {
    let node = this.result.get(nodeId);
    if (!node) {
      node = new Map();
      this.result.set(nodeId, node);
    }
    let port = node.get(portId);
    if (!port) {
      port = new Set(this.source.get(nodeId)?.get(portId));
      node.set(portId, port);
    }
    return port;
  }
}
