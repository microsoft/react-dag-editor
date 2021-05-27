import { fireEvent, render, RenderResult } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";
import {
  addState,
  allFeatures,
  GraphEdgeState,
  GraphFeatures,
  GraphModel,
  GraphNodeState,
  IPropsAPI,
  updateState
} from "../../src";
import { findDOMElement } from "../../src/utils/a11yUtils";
import { TestComponent } from "../TestComponent";
import { mockBoundingBox } from "../utils";
import { sampleData } from "./__data__/sample-data";

let wrapper: RenderResult;
let element: HTMLDivElement;
let svg: SVGSVGElement;
let propsAPI: IPropsAPI;

describe.skip("keyboard testing", () => {
  beforeEach(() => {
    const propsAPIRef = React.createRef<IPropsAPI>();
    const features = new Set(allFeatures);
    features.add(GraphFeatures.autoFit); // disable virtualization
    wrapper = render(
      <TestComponent propsAPIRef={propsAPIRef} data={GraphModel.fromJSON(sampleData)} features={features} />
    );
    element = wrapper.container.querySelector(".react-flow-editor-container") as HTMLDivElement;;
    svg = element.querySelector("svg") as SVGSVGElement;
    if (!propsAPIRef.current) {
      throw new Error();
    }
    propsAPI = propsAPIRef.current;
    mockBoundingBox();
  });
  
  it("should focus first node", () => {
    act(() => {
      fireEvent.keyDown(element, {
        key: "Tab"
      });
    });
    const data = propsAPI.getData();
    const id = data.head;
    if (!id) {
      throw new Error();
    }
    const node = data.nodes.get(id);
    expect(node?.state).toBe(GraphNodeState.selected);
  });
  
  it("should delete selected edge", () => {
    const id = "0";
    propsAPI.updateData(data => data.updateEdge(id, updateState(addState(GraphEdgeState.selected))));
    act(() => {
      fireEvent.keyDown(element, {
        key: "Delete"
      });
    });
    expect(propsAPI.getData().toJSON()).toEqual(
      GraphModel.fromJSON(sampleData)
        .deleteEdge(id)
        .toJSON()
    );
  });
  
  it("should undo, redo", () => {
    const id = "0";
    propsAPI.updateData(data => data.updateEdge(id, updateState(addState(GraphEdgeState.selected))));
    act(() => {
      fireEvent.keyDown(element, {
        key: "Delete"
      });
    });
    expect(propsAPI.getData().toJSON()).toEqual(
      GraphModel.fromJSON(sampleData)
        .deleteEdge(id)
        .toJSON()
    );
    act(() => {
      fireEvent.keyDown(element, {
        ctrlKey: true,
        metaKey: true,
        key: "z"
      });
    });
    expect(propsAPI.getData().toJSON()).toEqual(GraphModel.fromJSON(sampleData).toJSON());
    act(() => {
      fireEvent.keyDown(element, {
        ctrlKey: true,
        metaKey: true,
        key: "y"
      });
    });
    expect(propsAPI.getData().toJSON()).toEqual(
      GraphModel.fromJSON(sampleData)
        .deleteEdge(id)
        .toJSON()
    );
  });
  
  it("should select all", () => {
    act(() => {
      fireEvent.keyDown(element, {
        ctrlKey: true,
        metaKey: true,
        key: "a"
      });
    });
    expect(propsAPI.getData().toJSON()).toEqual(
      GraphModel.fromJSON(sampleData)
        .selectNodes(() => true)
        .toJSON()
    );
  });
  
  it("should copy and paste with edge", () => {
    propsAPI.updateData(data => data.selectNodes(node => node.id === "4b199015" || node.id === "fb404f70"));
    act(() => {
      fireEvent.keyDown(element, {
        ctrlKey: true,
        metaKey: true,
        key: "c"
      });
    });
    act(() => {
      fireEvent.keyDown(element, {
        ctrlKey: true,
        metaKey: true,
        key: "v"
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
          shiftKey
        });
      });
    svg.focus();
    const data = propsAPI.getData();
    const nodes = Array.from(data.nodes.values());
    tab();
    expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port: undefined }));
    const ports = nodes[0].ports!;
    ports.forEach(port => {
      tab();
      expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port }));
    });
    tab();
    expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[1], port: undefined }));
    ports
      .slice()
      .reverse()
      .forEach(port => {
        tab(true);
        expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port }));
      });
    tab(true);
    expect(document.activeElement).toBe(findDOMElement(svg, { node: nodes[0], port: undefined }));
  });
  
  it("should record keyup and keydown", () => {
    const getActiveKey = () => propsAPI.getGraphState().activeKeys;
    expect(getActiveKey().size).toBe(0);
    fireEvent.keyDown(element, {
      key: "a"
    });
    expect(getActiveKey().size).toBe(1);
    expect(getActiveKey()).toContain("a");
    fireEvent.keyDown(element, {
      key: "a"
    });
    expect(getActiveKey().size).toBe(1);
    expect(getActiveKey()).toContain("a");
    fireEvent.keyUp(element, {
      key: "b"
    });
    expect(getActiveKey().size).toBe(1);
    expect(getActiveKey()).toContain("a");
    fireEvent.keyDown(element, {
      key: "b"
    });
    expect(getActiveKey().size).toBe(2);
    expect(getActiveKey()).toContain("a");
    expect(getActiveKey()).toContain("b");
    fireEvent.keyUp(element, {
      key: "b"
    });
    expect(getActiveKey().size).toBe(1);
    expect(getActiveKey()).toContain("a");
    fireEvent.keyUp(element, {
      key: "a"
    });
    expect(getActiveKey().size).toBe(0);
  });
});

