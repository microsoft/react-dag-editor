import {
  GraphSource,
  IABOnlyNode,
  IGraphDiffResolver,
  IGraphEdge,
  IGraphNode,
  IMappingWithDiffInfo,
} from "../types";
import { GraphNodeDiffType, IDiffGraphNode } from "../types/diffGraph";
import { genAutoIncrementId } from "../util/id";

export const defaultBuildDiffNodes = async <
  Node extends IGraphNode,
  Edge extends IGraphEdge
>(
  mappings: IMappingWithDiffInfo<Node, Edge>[],
  abOnlyNodes: IABOnlyNode<Node>[],
  resolver: IGraphDiffResolver<Node, Edge>
): Promise<{
  diffGraphNodes: IDiffGraphNode<Node>[];
  diffNodeMap: Map<number, IDiffGraphNode<Node>>;
  lNodeId2diffNodeMap: Map<string, IDiffGraphNode<Node>>;
  rNodeId2diffNodeMap: Map<string, IDiffGraphNode<Node>>;
}> => {
  const genDiffGraphId = genAutoIncrementId();
  const diffGraphNodes: IDiffGraphNode<Node>[] = [];
  const diffNodeMap = new Map<number, IDiffGraphNode<Node>>();
  const lNodeId2diffNodeMap = new Map<string, IDiffGraphNode<Node>>();
  const rNodeId2diffNodeMap = new Map<string, IDiffGraphNode<Node>>();

  const addDiffNode = (diffNode: IDiffGraphNode<Node>): void => {
    diffGraphNodes.push(diffNode);
    diffNodeMap.set(diffNode.id, diffNode);
    if (diffNode.lNode) {
      lNodeId2diffNodeMap.set(diffNode.lNode.id, diffNode);
    }
    if (diffNode.rNode) {
      rNodeId2diffNodeMap.set(diffNode.rNode.id, diffNode);
    }
  };

  const addAOnlyNode = (node: Node): void => {
    const diffNode: IDiffGraphNode<Node> = {
      id: genDiffGraphId.next().value,
      diffType: GraphNodeDiffType.AOnly,
      lNode: node,
      rNode: undefined,
    };
    addDiffNode(diffNode);
  };

  const addBOnlyNode = (node: Node): void => {
    const diffNode: IDiffGraphNode<Node> = {
      id: genDiffGraphId.next().value,
      diffType: GraphNodeDiffType.BOnly,
      lNode: undefined,
      rNode: node,
    };
    addDiffNode(diffNode);
  };

  // A only / B only nodes.
  abOnlyNodes.forEach((item) => {
    if (item.active) {
      switch (item.fromGraph) {
        case GraphSource.A:
          addAOnlyNode(item.node);
          break;
        case GraphSource.B:
          addBOnlyNode(item.node);
          break;
        default:
      }
    }
  });

  // Paired nodes.
  for (const mapping of mappings) {
    const { lNode, rNode } = mapping;
    const diffNode: IDiffGraphNode<Node> = {
      id: genDiffGraphId.next().value,
      diffType: GraphNodeDiffType.equal,
      lNode,
      rNode,
    };

    if (!resolver.hasSamePorts(lNode, rNode)) {
      diffNode.diffType = GraphNodeDiffType.portChanged;
      addDiffNode(diffNode);
      continue;
    }

    if (mapping.cost.property !== 0) {
      diffNode.diffType = GraphNodeDiffType.propertyChanged;
      addDiffNode(diffNode);
      continue;
    }

    addDiffNode(diffNode);
  }
  return {
    diffGraphNodes,
    diffNodeMap,
    lNodeId2diffNodeMap,
    rNodeId2diffNodeMap,
  };
};
