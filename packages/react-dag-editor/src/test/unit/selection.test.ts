import {
  GraphEdgeStatus,
  GraphModel,
  GraphNodeStatus,
  GraphPortStatus,
  ICanvasData,
} from "../../index";
import { MouseEventButton } from "../../lib/common/constants";
import { nodeSelection } from "../../lib/utils";
import { makeEdges, makeNode, makeNodes, makePorts } from "../utils";

const ports = makePorts([
  GraphPortStatus.Default,
  GraphPortStatus.Default,
  GraphPortStatus.Default,
]);

function proceed(
  init: GraphModel,
  steps: Array<[(value: GraphModel) => GraphModel, ICanvasData]>
): void {
  let data = init;
  steps.forEach((step) => {
    data = step[0](data);
    expect(data.toJSON()).toEqual(step[1]);
  });
}

describe("node selection", () => {
  it("do nothing for editing node", () => {
    const event = new MouseEvent("mousedown", {
      shiftKey: false,
    });
    proceed(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
          [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
        ]),
        nodes: makeNodes(
          [
            GraphNodeStatus.Default,
            GraphNodeStatus.Editing,
            GraphNodeStatus.Default,
          ],
          ports
        ),
      }),
      [
        [
          nodeSelection(event, makeNode("1", GraphNodeStatus.Editing)),
          {
            edges: makeEdges([
              [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.Default,
                GraphNodeStatus.Editing,
                GraphNodeStatus.Default,
              ],
              ports
            ),
          },
        ],
      ]
    );
  });

  it("test single selection", () => {
    const event = new MouseEvent("mousedown", {
      shiftKey: false,
    });
    proceed(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
          [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
        ]),
        nodes: makeNodes(
          [
            GraphNodeStatus.Default,
            GraphNodeStatus.Default,
            GraphNodeStatus.Default,
          ],
          ports
        ),
      }),
      [
        [
          nodeSelection(event, makeNode("1", GraphNodeStatus.Default)),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.UnconnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.ConnectedToSelected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.UnconnectedToSelected,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(event, makeNode("1", GraphNodeStatus.Selected)),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.UnconnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.ConnectedToSelected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.UnconnectedToSelected,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(
            event,
            makeNode("0", GraphNodeStatus.UnconnectedToSelected)
          ),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.ConnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.Selected,
                GraphNodeStatus.ConnectedToSelected,
                GraphNodeStatus.ConnectedToSelected,
              ],
              ports
            ),
          },
        ],
      ]
    );
  });

  it("test multiple selection", () => {
    const event = new MouseEvent("mousedown", {
      ctrlKey: true,
    });
    proceed(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
          [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
        ]),
        nodes: makeNodes(
          [
            GraphNodeStatus.Default,
            GraphNodeStatus.Default,
            GraphNodeStatus.Default,
          ],
          ports
        ),
      }),
      [
        [
          nodeSelection(event, makeNode("1", GraphNodeStatus.Default)),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.UnconnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.ConnectedToSelected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.UnconnectedToSelected,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(event, makeNode("1", GraphNodeStatus.Selected)),
          {
            edges: makeEdges([
              [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.Default,
                GraphNodeStatus.Default,
                GraphNodeStatus.Default,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(event, makeNode("1", GraphNodeStatus.Default)),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.UnconnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.ConnectedToSelected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.UnconnectedToSelected,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(
            event,
            makeNode("0", GraphNodeStatus.UnconnectedToSelected)
          ),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.ConnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.Selected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.ConnectedToSelected,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(event, makeNode("0", GraphNodeStatus.Selected)),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.UnconnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.ConnectedToSelected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.UnconnectedToSelected,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(
            new MouseEvent("mousedown", {
              ctrlKey: true,
              button: MouseEventButton.Secondary,
            }),
            makeNode("0", GraphNodeStatus.UnconnectedToSelected)
          ),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.ConnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.Selected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.ConnectedToSelected,
              ],
              ports
            ),
          },
        ],
        [
          nodeSelection(
            new MouseEvent("mousedown", {
              ctrlKey: true,
              button: MouseEventButton.Secondary,
            }),
            makeNode("0", GraphNodeStatus.Selected)
          ),
          {
            edges: makeEdges([
              [GraphEdgeStatus.ConnectedToSelected, ["0", "0"], ["1", "1"]],
              [GraphEdgeStatus.ConnectedToSelected, ["0", "1"], ["2", "0"]],
            ]),
            nodes: makeNodes(
              [
                GraphNodeStatus.Selected,
                GraphNodeStatus.Selected,
                GraphNodeStatus.ConnectedToSelected,
              ],
              ports
            ),
          },
        ],
      ]
    );
  });
});
