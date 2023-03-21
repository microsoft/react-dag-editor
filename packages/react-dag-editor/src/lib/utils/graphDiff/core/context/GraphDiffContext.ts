import {
  IGraph,
  IGraphDiffContext,
  IGraphEdge,
  IGraphNode,
  IGraphNodeOutgoingEdge,
  IGraphNodeWithStructure,
} from "../types";

export interface IGraphDiffContextProps<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  readonly lGraph: IGraph<Node, Edge>;
  readonly rGraph: IGraph<Node, Edge>;
}

export class GraphDiffContext<Node extends IGraphNode, Edge extends IGraphEdge>
  implements IGraphDiffContext<Node, Edge>
{
  public readonly ABOnlyCostThreshold: number = 100000;
  public readonly PropertyDiffCostRate: number = 0.2;
  public readonly StructureDiffCostRate: number = 1;

  public readonly lGraph: IGraph<Node, Edge>;
  public readonly rGraph: IGraph<Node, Edge>;

  public readonly lNodesMap: ReadonlyMap<
    string,
    IGraphNodeWithStructure<Node, Edge>
  >;
  public readonly rNodesMap: ReadonlyMap<
    string,
    IGraphNodeWithStructure<Node, Edge>
  >;

  public constructor(props: IGraphDiffContextProps<Node, Edge>) {
    this.lGraph = props.lGraph;
    this.rGraph = props.rGraph;
    this.lNodesMap = this.buildNodeMap(props.lGraph);
    this.rNodesMap = this.buildNodeMap(props.rGraph);
  }

  protected buildNodeMap(
    graph: IGraph<Node, Edge>
  ): ReadonlyMap<string, IGraphNodeWithStructure<Node, Edge>> {
    const nodeMap: Map<string, IGraphNodeWithStructure<Node, Edge>> = new Map();
    const idToNodeMap = new Map<string, Node>();
    for (const node of graph.nodes) {
      idToNodeMap.set(node.id, node);
    }

    for (const edge of graph.edges) {
      const sourceNode = idToNodeMap.get(edge.source);
      const targetNode = idToNodeMap.get(edge.target);
      if (sourceNode && targetNode) {
        {
          const outEdge: IGraphNodeOutgoingEdge<Node, Edge> = {
            portId: edge.sourcePort,
            targetNode,
            targetPortId: edge.targetPort,
            originalEdge: edge,
          };

          const sourceNodeWithStructure = nodeMap.get(edge.source);
          if (sourceNodeWithStructure) {
            sourceNodeWithStructure.outEdges.push(outEdge);
          } else {
            nodeMap.set(edge.source, {
              node: sourceNode,
              inEdges: [],
              outEdges: [outEdge],
            });
          }
        }

        {
          const inEdge: IGraphNodeOutgoingEdge<Node, Edge> = {
            portId: edge.targetPort,
            targetNode: sourceNode,
            targetPortId: edge.sourcePort,
            originalEdge: edge,
          };

          const targetNodeWithStructure = nodeMap.get(edge.target);
          if (targetNodeWithStructure) {
            targetNodeWithStructure.inEdges.push(inEdge);
          } else {
            nodeMap.set(edge.target, {
              node: targetNode,
              inEdges: [inEdge],
              outEdges: [],
            });
          }
        }
      }
    }

    return nodeMap;
  }
}
