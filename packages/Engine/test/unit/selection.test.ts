import { GraphEdgeState, GraphModel, GraphNodeState, GraphPortState, ICanvasData } from "../../src";
import { MouseEventButton } from "../../src/common/constants";
import { nodeSelection } from "../../src/utils";
import { makeEdges, makeNode, makeNodes, makePorts } from "../utils";

const ports = makePorts([GraphPortState.default, GraphPortState.default, GraphPortState.default]);

function proceed(init: GraphModel, steps: Array<[(value: GraphModel) => GraphModel, ICanvasData]>): void {
  let data = init;
  steps.forEach(step => {
    data = step[0](data);
    expect(data.toJSON()).toEqual(step[1]);
  });
}

describe("node selection", () => {
  it("do nothing for editing node", () => {
    const event = new MouseEvent("mousedown", {
      shiftKey: false
    });
    proceed(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeState.default, ["0", "0"], ["1", "1"]],
          [GraphEdgeState.default, ["0", "1"], ["2", "0"]]
        ]),
        nodes: makeNodes([GraphNodeState.default, GraphNodeState.editing, GraphNodeState.default], ports)
      }),
      [
        [
          nodeSelection(event, makeNode("1", GraphNodeState.editing)),
          {
            edges: makeEdges([
              [GraphEdgeState.default, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.default, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes([GraphNodeState.default, GraphNodeState.editing, GraphNodeState.default], ports)
          }
        ]
      ]
    );
  });

  it("test single selection", () => {
    const event = new MouseEvent("mousedown", {
      shiftKey: false
    });
    proceed(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeState.default, ["0", "0"], ["1", "1"]],
          [GraphEdgeState.default, ["0", "1"], ["2", "0"]]
        ]),
        nodes: makeNodes([GraphNodeState.default, GraphNodeState.default, GraphNodeState.default], ports)
      }),
      [
        [
          nodeSelection(event, makeNode("1", GraphNodeState.default)),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.unconnectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.connectedToSelected, GraphNodeState.selected, GraphNodeState.unconnectedToSelected],
              ports
            )
          }
        ],
        [
          nodeSelection(event, makeNode("1", GraphNodeState.selected)),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.unconnectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.connectedToSelected, GraphNodeState.selected, GraphNodeState.unconnectedToSelected],
              ports
            )
          }
        ],
        [
          nodeSelection(event, makeNode("0", GraphNodeState.unconnectedToSelected)),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.connectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.selected, GraphNodeState.connectedToSelected, GraphNodeState.connectedToSelected],
              ports
            )
          }
        ]
      ]
    );
  });

  it("test multiple selection", () => {
    const event = new MouseEvent("mousedown", {
      ctrlKey: true
    });
    proceed(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeState.default, ["0", "0"], ["1", "1"]],
          [GraphEdgeState.default, ["0", "1"], ["2", "0"]]
        ]),
        nodes: makeNodes([GraphNodeState.default, GraphNodeState.default, GraphNodeState.default], ports)
      }),
      [
        [
          nodeSelection(event, makeNode("1", GraphNodeState.default)),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.unconnectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.connectedToSelected, GraphNodeState.selected, GraphNodeState.unconnectedToSelected],
              ports
            )
          }
        ],
        [
          nodeSelection(event, makeNode("1", GraphNodeState.selected)),
          {
            edges: makeEdges([
              [GraphEdgeState.default, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.default, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes([GraphNodeState.default, GraphNodeState.default, GraphNodeState.default], ports)
          }
        ],
        [
          nodeSelection(event, makeNode("1", GraphNodeState.default)),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.unconnectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.connectedToSelected, GraphNodeState.selected, GraphNodeState.unconnectedToSelected],
              ports
            )
          }
        ],
        [
          nodeSelection(event, makeNode("0", GraphNodeState.unconnectedToSelected)),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.connectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.selected, GraphNodeState.selected, GraphNodeState.connectedToSelected],
              ports
            )
          }
        ],
        [
          nodeSelection(event, makeNode("0", GraphNodeState.selected)),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.unconnectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.connectedToSelected, GraphNodeState.selected, GraphNodeState.unconnectedToSelected],
              ports
            )
          }
        ],
        [
          nodeSelection(
            new MouseEvent("mousedown", {
              ctrlKey: true,
              button: MouseEventButton.Secondary
            }),
            makeNode("0", GraphNodeState.unconnectedToSelected)
          ),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.connectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.selected, GraphNodeState.selected, GraphNodeState.connectedToSelected],
              ports
            )
          }
        ],
        [
          nodeSelection(
            new MouseEvent("mousedown", {
              ctrlKey: true,
              button: MouseEventButton.Secondary
            }),
            makeNode("0", GraphNodeState.selected)
          ),
          {
            edges: makeEdges([
              [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeState.connectedToSelected, ["0", "1"], ["2", "0"]]
            ]),
            nodes: makeNodes(
              [GraphNodeState.selected, GraphNodeState.selected, GraphNodeState.connectedToSelected],
              ports
            )
          }
        ]
      ]
    );
  });
});
