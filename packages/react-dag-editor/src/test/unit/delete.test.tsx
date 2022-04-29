import { act, render } from "@testing-library/react";
import * as React from "react";
import {
  dataReadonlyMode,
  GraphCanvasEvent,
  GraphEdgeStatus,
  GraphModel,
  GraphNodeStatus,
  GraphPortStatus,
  notSelected,
} from "../../index";
import { GraphController } from "../../lib/controllers/GraphController";
import { GraphControllerRef, TestComponent } from "../TestComponent";
import { makeEdges, makeNodes, makePorts } from "../utils";

const ports = makePorts([
  GraphPortStatus.Default,
  GraphPortStatus.Default,
  GraphPortStatus.Default,
]);

const deleteSelectedItems = (data: GraphModel) => {
  return data.deleteItems({
    node: notSelected,
    edge: notSelected,
  });
};

it("should do nothing if delete disabled", () => {
  const data = GraphModel.fromJSON({
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
  });

  const graphControllerRef = React.createRef<GraphController>();
  render(
    <TestComponent
      data={data}
      settings={{
        features: dataReadonlyMode,
      }}
    >
      <GraphControllerRef ref={graphControllerRef} />
    </TestComponent>
  );

  const graphController = graphControllerRef.current!;
  expect(graphController).toBeDefined();

  act(() => {
    graphController.dispatch({
      type: GraphCanvasEvent.Delete,
    });
  });

  expect(graphController.state.data.present.toJSON()).toMatchSnapshot();
});

it("should do nothing if nothing selected", () => {
  const data = GraphModel.fromJSON({
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
  });

  expect(deleteSelectedItems(data).toJSON()).toMatchSnapshot();
});

it("should delete related edges", () => {
  const data = GraphModel.fromJSON({
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
  });

  expect(deleteSelectedItems(data).toJSON()).toMatchSnapshot();
});

it("should only delete node", () => {
  const data = GraphModel.fromJSON({
    edges: [],
    nodes: makeNodes(
      [
        GraphNodeStatus.UnconnectedToSelected,
        GraphNodeStatus.Selected,
        GraphNodeStatus.UnconnectedToSelected,
      ],
      ports
    ),
  });

  expect(deleteSelectedItems(data).toJSON()).toMatchSnapshot();
});

it("should only delete edge", () => {
  const data = GraphModel.fromJSON({
    edges: makeEdges([
      [GraphEdgeStatus.Selected, ["0", "0"], ["1", "1"]],
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
  });
  expect(deleteSelectedItems(data).toJSON()).toMatchSnapshot();
});
