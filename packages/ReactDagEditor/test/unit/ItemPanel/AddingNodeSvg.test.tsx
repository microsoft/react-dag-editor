/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, cleanup, fireEvent, render, RenderResult, screen } from "@testing-library/react";
import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { defaultFeatures, EMPTY_VIEW_PORT, PropsAPIContext } from "../../../src";
import { MouseEventButton } from "../../../src/common/constants";
import { Item } from "../../../src/components/ItemPanel";
import { AddingNodeSvg } from "../../../src/components/ItemPanel/AddingNodeSvg";
import { ICanvasNode } from "../../../src/Graph.interface";
import { noopInstance } from "../../../src/props-api/IPropsAPIInstance";
import { PropsAPI } from "../../../src/props-api/PropsAPI";
import { EventChannel } from "../../../src/utils/eventChannel";
import { graphController } from "../../../src/utils/graphController";
import { patchPointerEvent } from "../../utils";
import { withGraphConfigContext } from "../__mocks__/mockContext";
import { mockPropsAPI } from "../__mocks__/mockPropsAPI";
import { TestItemContent } from "./TestItemContent";

const rect = {
  left: 100,
  top: 100,
  width: 800,
  height: 800,
  right: 900,
  bottom: 900
};

const propsAPI = {
  ...mockPropsAPI,
  getEventChannel: () => new EventChannel(),
  getViewport() {
    return {
      transformMatrix: [1, 0, 0, 1, 0, 0],
      visibleRect: rect,
      rect
    };
  }
} as PropsAPI<any, any, any>;

jest.mock("../../../src/hooks/usePropsAPI", () => ({
  usePropsAPI: () => propsAPI
}));

jest.mock("../../../src/components/ItemPanel/useSvgRect", () => ({
  useSvgRect: () => {
    return rect;
  }
}));

describe("ItemPanel - AddingNodeSvg", () => {
  let nodeWillAdd: () => ICanvasNode;
  let nodeDidAdd: () => void;
  let renderedWrapper: RenderResult;
  beforeAll(() => {
    patchPointerEvent();
    jest.spyOn(PropsAPI.prototype, "getGraphSvgRef").mockReturnValue({
      current: document.createElementNS("http://www.w3.org/2000/svg", "svg")
    });
    jest.spyOn(graphController, "getEnabledFeatures").mockReturnValue(defaultFeatures);
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    nodeWillAdd = jest.fn();
    nodeDidAdd = jest.fn();

    renderedWrapper = render(
      withGraphConfigContext(
        <PropsAPIContext.Provider value={propsAPI}>
          <Item
            model={{ name: "node1", shape: "nodeShape" }}
            dragWillStart={jest.fn()}
            nodeWillAdd={nodeWillAdd}
            nodeDidAdd={nodeDidAdd}
          >
            <TestItemContent text="test item for addingNodeSVG" />
          </Item>
        </PropsAPIContext.Provider>
      )
    );
  });

  afterEach(cleanup);

  /**
   * @param el
   * @param mouseEventButton
   * @param points
   */
  function simulateDragging(
    el: HTMLElement | Window,
    mouseEventButton: MouseEventButton,
    points: Array<[number, number]>
  ): void {
    if (points.length === 0) {
      return;
    }

    const first = points[0];
    act(() => {
      fireEvent.pointerDown(el, {
        clientX: first[0],
        clientY: first[1],
        button: mouseEventButton,
        pointerType: "mouse"
      });
      jest.runAllTimers();
    });

    points.forEach(([clientX, clientY]) => {
      act(() => {
        fireEvent.pointerMove(window, {
          clientX,
          clientY,
          button: mouseEventButton,
          pointerType: "mouse"
        });
      });
    });

    const last = points[points.length - 1];
    act(() => {
      jest.runAllTimers();
      fireEvent.pointerUp(window, {
        clientX: last[0],
        clientY: last[1],
        button: mouseEventButton,
        pointerType: "mouse"
      });
    });
  }

  it("Should match the snapshot", () => {
    const renderer = ShallowRenderer.createRenderer();
    expect(
      renderer.render(
        <AddingNodeSvg
          nextNodeRef={{ current: null }}
          model={{
            name: "node1",
            shape: "nodeShape",
            x: 0,
            y: 0,
            id: "mock-id"
          }}
          svgRef={React.createRef<SVGSVGElement>()}
        />
      )
    ).toMatchSnapshot();
  });

  it("adding node", () => {
    const containerRect = {
      current: {
        top: 50,
        right: 200,
        bottom: 200,
        left: 50,
        width: 150,
        height: 150,
        x: 50,
        y: 50
      }
    };
    noopInstance.containerRectRef = containerRect;
    EMPTY_VIEW_PORT.rect = containerRect as any;

    simulateDragging(screen.getByRole("button"), MouseEventButton.Primary, [
      [100, 100],
      [105, 105]
    ]);

    expect(nodeWillAdd).toBeCalledTimes(1);
    expect(nodeDidAdd).toBeCalledTimes(1);
    expect(renderedWrapper.container).toMatchSnapshot();
  });

  it("not adding node if out of graph", () => {
    jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 50,
      right: 200,
      bottom: 200,
      left: 50,
      width: 150,
      height: 150,
      x: 50,
      y: 50
    } as any);

    simulateDragging(screen.getByRole("button"), MouseEventButton.Primary, [
      [25, 25],
      [30, 30]
    ]);

    expect(nodeWillAdd).not.toBeCalled();
    expect(nodeDidAdd).not.toBeCalled();
    expect(renderedWrapper.container).toMatchSnapshot();
  });

  it("without left mouse down when dragging", () => {
    simulateDragging(screen.getByRole("button"), MouseEventButton.Secondary, [
      [100, 100],
      [105, 105]
    ]);

    expect(nodeWillAdd).not.toBeCalled();
    expect(nodeDidAdd).not.toBeCalled();
    expect(renderedWrapper.container).toMatchSnapshot();
  });
});
