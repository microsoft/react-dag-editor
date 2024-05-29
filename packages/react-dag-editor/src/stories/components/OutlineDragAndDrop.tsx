import { mergeStyles } from "@fluentui/merge-styles";
import * as React from "react";
import {
  Bitset,
  getRectHeight,
  getRectWidth,
  Graph,
  GraphConfigBuilder,
  GraphNodeStatus,
  Item,
  ReactDagEditor,
  useGraphReducer,
} from "../..";

export const OutlineDragAndDrop: React.FC = () => {
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig: GraphConfigBuilder.default()
          .registerNode(node => {
            return {
              // min height constraint for node resizing.
              getMinHeight: () => 60,
              // min width constraint for node resizing.
              getMinWidth: () => 100,
              // render decides the element to represent a node
              render(args): React.ReactNode {
                const height = getRectHeight(this, args.model);
                const width = getRectWidth(this, args.model);

                const fill = Bitset.has(GraphNodeStatus.Activated)(args.model.status) ? "gray" : "white";
                const stroke = Bitset.has(GraphNodeStatus.Selected)(args.model.status) ? "red" : "blue";

                return (
                  <g transform={`translate(${args.model.x}, ${args.model.y})`}>
                    <rect width={width} height={height} stroke={stroke} strokeWidth={2} fill={fill} fillOpacity={0.8} />
                    <text x={10} y={20}>
                      {(node.data as { id: string; title: string })?.title}
                    </text>
                  </g>
                );
              },
            };
          })
          .build(),
      },
      data: undefined,
    },
    undefined,
  );

  const nodes = React.useMemo(() => {
    return [
      { id: "0", title: "Node - 0" },
      { id: "1", title: "Node - 1" },
      { id: "2", title: "Node - 2" },
      { id: "3", title: "Node - 3" },
      { id: "4", title: "Node - 4" },
      { id: "5", title: "Node - 5" },
      { id: "6", title: "Node - 6" },
    ];
  }, []);

  const itemCls = mergeStyles({
    display: "flex",
    alignItems: "center",
    padding: "8px 4px",
    cursor: "pointer",
    "&:hover": {
      color: "white",
      backgroundColor: "gray",
    },
  });

  return (
    <ReactDagEditor style={{ display: "flex", width: "900px", height: "600px" }} state={state} dispatch={dispatch}>
      <ul style={{ width: "200px", flexShrink: 0, listStyle: "none", padding: 0 }}>
        {nodes.map(node => (
          <li key={node.id}>
            <Item
              getNode={() => {
                return {
                  ...node,
                  data: {
                    ...node,
                  },
                };
              }}
            >
              <div className={itemCls}>{node.title}</div>
            </Item>
          </li>
        ))}
      </ul>
      <Graph />
    </ReactDagEditor>
  );
};
