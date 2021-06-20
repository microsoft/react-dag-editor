import * as React from "react";
import { OrderedMap } from "../../collections";
import { INode, NodeType } from "../../collections/b-tree";
import { NodeModel } from "../../models/NodeModel";
import { GraphNodeParts, IGraphNodePartsProps } from "../GraphNodeParts";

export interface INodeTreeNodeProps extends Omit<IGraphNodePartsProps, "node" | "viewPort"> {
  node: INode<number, [string, NodeModel]>;
}

export interface INodeTreeProps extends Omit<INodeTreeNodeProps, "node"> {
  tree: OrderedMap<string, NodeModel>;
}

const NodeTreeNode = React.memo<INodeTreeNodeProps>(
  ({ node, ...others }) => {
    const values = node.values.map(arg => {
      const it = arg[1];
      return <GraphNodeParts key={it.id} node={it} {...others} />;
    });

    const children =
      node.type === NodeType.Internal
        ? node.children.map((child, index) => {
            const key = index < node.selfSize ? node.getKey(index) : "last";
            return <NodeTreeNode key={key} node={child} {...others} />;
          })
        : undefined;

    return (
      <>
        {values}
        {children}
      </>
    );
  },
  (prevProps, nextProps) => prevProps.node === nextProps.node
);

NodeTreeNode.displayName = "NodeTreeNode";

export const NodeTree: React.FunctionComponent<INodeTreeProps> = ({
  tree,
  ...others
}) => {
  return <NodeTreeNode node={tree.sortedRoot} {...others} />;
};
