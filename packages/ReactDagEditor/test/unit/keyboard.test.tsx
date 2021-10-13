import { fireEvent, render, RenderResult } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";
import {
  allFeatures,
  Bitset,
  GraphCanvasEvent,
  GraphEdgeStatus,
  GraphFeatures,
  GraphModel,
  GraphNodeStatus,
  updateStatus,
} from "../../src";
import { GraphController } from "../../src/controllers/GraphController";
import { findDOMElement } from "../../src/utils/a11yUtils";
import { GraphControllerRef, TestComponent } from "../TestComponent";
import { mockBoundingBox, mockClientRect } from "../utils";
import { getSample1Data } from "./__data__/getSample1Data";

let wrapper: RenderResult;
let element: HTMLDivElement;
let svg: SVGSVGElement;
let graphController: GraphController;

const getData = () => graphController.state.data.present;
const updateData = (f: (prev: GraphModel) => GraphModel) =>
  act(() => {
    graphController.dispatch({
      type: GraphCanvasEvent.UpdateData,
      updater: f,
      shouldRecord: false,
    });
  });

beforeEach(() => {
  const graphControllerRef = React.createRef<GraphController>();
  const features = new Set(allFeatures);
  features.add(GraphFeatures.AutoFit); // disable virtualization
  wrapper = render(
    <TestComponent
      data={GraphModel.fromJSON(getSample1Data())}
      settings={{
        features,
      }}
    >
      <GraphControllerRef ref={graphControllerRef} />
    </TestComponent>
  );
  element = wrapper.container.querySelector(".react-dag-editor-container") as HTMLDivElement;
  svg = element.querySelector("svg") as SVGSVGElement;
  graphController = graphControllerRef.current!;
  expect(graphController).toBeDefined();
  mockBoundingBox();
  act(() => {
    graphController.dispatch({
      type: GraphCanvasEvent.ViewportResize,
      viewportRect: mockClientRect,
    });
  });
});

it("should focus first node", () => {
  act(() => {
    fireEvent.keyDown(element, {
      key: "Tab",
    });
  });
  const data = getData();
  const id = data.head;
  if (!id) {
    throw new Error();
  }
  const node = data.nodes.get(id);
  expect(node?.status).toBe(GraphNodeStatus.Selected);
});

it("should delete selected edge", () => {
  const id = "0";
  updateData((data) => data.updateEdge(id, updateStatus(Bitset.add(GraphEdgeStatus.Selected))));
  act(() => {
    fireEvent.keyDown(element, {
      key: "Delete",
    });
  });
  expect(getData().toJSON()).toEqual(GraphModel.fromJSON(getSample1Data()).deleteEdge(id).toJSON());
});

it("should undo, redo", () => {
  const id = "0";
  updateData((data) => data.updateEdge(id, updateStatus(Bitset.add(GraphEdgeStatus.Selected))));
  act(() => {
    fireEvent.keyDown(element, {
      key: "Delete",
    });
  });
  expect(getData().toJSON()).toEqual(GraphModel.fromJSON(getSample1Data()).deleteEdge(id).toJSON());
  act(() => {
    fireEvent.keyDown(element, {
      ctrlKey: true,
      metaKey: true,
      key: "z",
    });
  });
  expect(getData().toJSON()).toEqual(GraphModel.fromJSON(getSample1Data()).toJSON());
  act(() => {
    fireEvent.keyDown(element, {
      ctrlKey: true,
      metaKey: true,
      key: "y",
    });
  });
  expect(getData().toJSON()).toEqual(GraphModel.fromJSON(getSample1Data()).deleteEdge(id).toJSON());
});

it("should select all", () => {
  act(() => {
    fireEvent.keyDown(element, {
      ctrlKey: true,
      metaKey: true,
      key: "a",
    });
  });
  expect(getData().toJSON()).toEqual(
    GraphModel.fromJSON(getSample1Data())
      .selectNodes(() => true)
      .toJSON()
  );
});

it("should copy and paste with edge", () => {
  updateData((data) => data.selectNodes((node) => node.id === "4b199015" || node.id === "fb404f70"));
  act(() => {
    fireEvent.keyDown(element, {
      ctrlKey: true,
      metaKey: true,
      key: "c",
    });
  });
  act(() => {
    fireEvent.keyDown(element, {
      ctrlKey: true,
      metaKey: true,
      key: "v",
    });
  });
  expect(wrapper.container).toMatchSnapshot();
});

it("should navigate with keyboard", () => {
  const tab = (shiftKey = false) =>
    act(() => {
      const target = document.activeElement!.tagName.toLowerCase() === "svg" ? element : document.activeElement!;
      fireEvent.keyDown(target, {
        key: "Tab",
        shiftKey,
      });
    });
  svg.focus();
  const data = getData();
  const nodes = Array.from(data.nodes.values());
  tab();
  expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port: undefined }));
  const ports = nodes[0].ports!;
  ports.forEach((port) => {
    tab();
    expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port }));
  });
  tab();
  expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[1], port: undefined }));
  ports
    .slice()
    .reverse()
    .forEach((port) => {
      tab(true);
      expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port }));
    });
  tab(true);
  expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port: undefined }));
});

it("should record keyup and keydown", () => {
  const getActiveKey = () => graphController.state.activeKeys;
  expect(getActiveKey().size).toBe(0);
  fireEvent.keyDown(element, {
    key: "a",
  });
  expect(getActiveKey().size).toBe(1);
  expect(getActiveKey()).toContain("a");
  fireEvent.keyDown(element, {
    key: "a",
  });
  expect(getActiveKey().size).toBe(1);
  expect(getActiveKey()).toContain("a");
  fireEvent.keyUp(element, {
    key: "b",
  });
  expect(getActiveKey().size).toBe(1);
  expect(getActiveKey()).toContain("a");
  fireEvent.keyDown(element, {
    key: "b",
  });
  expect(getActiveKey().size).toBe(2);
  expect(getActiveKey()).toContain("a");
  expect(getActiveKey()).toContain("b");
  fireEvent.keyUp(element, {
    key: "b",
  });
  expect(getActiveKey().size).toBe(1);
  expect(getActiveKey()).toContain("a");
  fireEvent.keyUp(element, {
    key: "a",
  });
  expect(getActiveKey().size).toBe(0);
});
