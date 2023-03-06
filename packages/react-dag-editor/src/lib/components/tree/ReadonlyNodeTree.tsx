import * as React from "react";
import { OrderedMap } from "../../collections";
import { INode, NodeType } from "../../collections/b-tree";
import { NodeModel } from "../../models/NodeModel";
import { StaticNode } from "../StaticGraph/StaticNode";

export interface IReadonlyNodeTreeNodeProps {
  node: INode<number, [string, NodeModel]>;
}

export interface IReadonlyNodeTreeProps {
  tree: OrderedMap<string, NodeModel>;
}

const ReadonlyNodeTreeNode = React.memo<IReadonlyNodeTreeNodeProps>(
  ({ node }) => {
    const values = node.values.map((it) => (
      <StaticNode key={it[1].id} node={it[1]} />
    ));
    const children =
      node.type === NodeType.Internal
        ? node.children.map((child, index) => {
            const key = index < node.selfSize ? node.getKey(index) : "last";
            return <ReadonlyNodeTreeNode key={key} node={child} />;
          })
        : undefined;

    return (
      <>
        {values}
        {children}
      </>
    );
  }
);

ReadonlyNodeTreeNode.displayName = "ReadonlyNodeTreeNode";

export const ReadonlyNodeTree: React.FunctionComponent<
  IReadonlyNodeTreeProps
> = ({ tree }) => {
  return <ReadonlyNodeTreeNode node={tree.sortedRoot} />;
};
