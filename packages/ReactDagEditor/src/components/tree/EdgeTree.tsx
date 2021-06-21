import * as React from "react";
import { HashMap } from "../../collections";
import { BitmapIndexedNode, HashCollisionNode, NodeType } from "../../collections/champ";
import { EdgeModel } from "../../models/EdgeModel";
import { GraphEdge, IGraphEdgeCommonProps } from "../GraphEdge";

export interface IEdgeChampNodeRenderProps extends IGraphEdgeCommonProps {
  node: BitmapIndexedNode<string, EdgeModel>;
}

export interface IEdgeHashCollisionNodeRenderProps extends IGraphEdgeCommonProps {
  node: HashCollisionNode<string, EdgeModel>;
}

export interface IEdgeTreeProps extends IGraphEdgeCommonProps {
  tree: HashMap<string, EdgeModel>;
}

function compareEqual(
  prev: IEdgeChampNodeRenderProps | IEdgeHashCollisionNodeRenderProps,
  props: IEdgeChampNodeRenderProps | IEdgeHashCollisionNodeRenderProps
): boolean {
  return prev.node === props.node;
}

const EdgeChampNodeRender = React.memo<IEdgeChampNodeRenderProps>(props => {
  const { node, data, graphConfig, ...others } = props;
  const values: React.ReactNode[] = [];
  const valueCount = node.valueCount;
  for (let i = 0; i < valueCount; i += 1) {
    const it = node.getValue(i);
    const source = data.nodes.get(it.source)?.getPortPosition(it.sourcePortId, graphConfig);
    const target = data.nodes.get(it.target)?.getPortPosition(it.targetPortId, graphConfig);
    if (source && target) {
      values.push(
        <GraphEdge
          {...others}
          key={it.id}
          data={data}
          graphConfig={graphConfig}
          edge={it}
          source={source}
          target={target}
        />
      );
    }
  }

  const children: React.ReactNode[] = [];
  const nodeCount = node.nodeCount;
  for (let i = 0; i < nodeCount; i += 1) {
    const it = node.getNode(i);
    if (it.type === NodeType.Bitmap) {
      children.push(<EdgeChampNodeRender key={node.getHash(i)} {...props} node={it} />);
    } else {
      children.push(<EdgeHashCollisionNodeRender key={it.getHash()} {...props} node={it} />);
    }
  }

  return (
    <>
      {values}
      {children}
    </>
  );
}, compareEqual);

EdgeChampNodeRender.displayName = "EdgeChampNodeRender";

const EdgeHashCollisionNodeRender = React.memo<IEdgeHashCollisionNodeRenderProps>(props => {
  const { data, node, graphConfig, ...others } = props;
  return (
    <>
      {node.values.map(edge => {
        const source = data.nodes.get(edge.source)?.getPortPosition(edge.sourcePortId, graphConfig);
        const target = data.nodes.get(edge.target)?.getPortPosition(edge.targetPortId, graphConfig);
        if (source && target) {
          return (
            <GraphEdge
              {...others}
              key={edge.id}
              data={data}
              graphConfig={graphConfig}
              edge={edge}
              source={source}
              target={target}
            />
          );
        } else {
          return null;
        }
      })}
    </>
  );
}, compareEqual);

EdgeHashCollisionNodeRender.displayName = "EdgeHashCollisionNodeRender";

export const EdgeTree: React.FunctionComponent<IEdgeTreeProps> = props => {
  const { tree, ...others } = props;
  return <EdgeChampNodeRender {...others} node={tree.root} />;
};
