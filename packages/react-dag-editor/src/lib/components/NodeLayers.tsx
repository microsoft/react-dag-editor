import * as React from "react";
import { OrderedMap } from "../collections";
import { GraphModel } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
interface INodeLayersProps {
  data: GraphModel;
  renderTree(tree: OrderedMap<string, NodeModel>, layer: number): JSX.Element;
}
export const NodeLayers: React.FC<INodeLayersProps> = ({ data, renderTree }) => {
  const layers = new Set<number>();
  data.nodes.forEach(n => layers.add(n.layer));

  return (
    <>
      {Array.from(layers.values())
        .sort()
        .map(l =>
          renderTree(
            data.nodes.filter(n => n.layer === l),
            l,
          ),
        )}
    </>
  );
};
