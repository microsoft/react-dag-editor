/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, cleanup, fireEvent, render, RenderResult, screen } from "@testing-library/react";
import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { GraphCanvasEvent, GraphStateStore } from "../../../src";
import { MouseEventButton } from "../../../src/common/constants";
import { Item } from "../../../src/components/ItemPanel";
import { AddingNodeSvg } from "../../../src/components/ItemPanel/AddingNodeSvg";
import { GraphController } from "../../../src/controllers/GraphController";
import { ICanvasNode } from "../../../src/models/node";
import { GraphControllerRef } from "../../TestComponent";
import { mockClientRect, patchPointerEvent } from "../../utils";
import { withGraphConfigContext } from "../__mocks__/mockContext";
import { TestItemContent } from "./TestItemContent";

jest.mock("../../../src/components/ItemPanel/useSvgRect", () => ({
  useSvgRect: () => {
    return mockClientRect;
  }
}));

describe("ItemPanel - AddingNodeSvg", () => {
  let nodeWillAdd: () => ICanvasNode;
  let nodeDidAdd: () => void;
  let renderedWrapper: RenderResult;
  let graphController: GraphController;
  beforeAll(() => {
    patchPointerEvent();
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    nodeWillAdd = jest.fn();
    nodeDidAdd = jest.fn();
    const graphControllerRef = React.createRef<GraphController>();
    renderedWrapper = render(
      withGraphConfigContext(
        <GraphStateStore>
          <Item
            model={{ name: "node1", shape: "nodeShape" }}
            dragWillStart={jest.fn()}
            nodeWillAdd={nodeWillAdd}
            nodeDidAdd={nodeDidAdd}
          >
            <TestItemContent text="test item for addingNodeSVG" />
          </Item>
          <GraphControllerRef ref={graphControllerRef} />
        </GraphStateStore>
      )
    );
    graphController = graphControllerRef.current!;
    expect(graphController).toBeDefined();
    act(() => {
      graphController.dispatch({
        type: GraphCanvasEvent.ViewportResize,
        viewportRect: mockClientRect
      });
    });
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
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it("adding node", () => {
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
