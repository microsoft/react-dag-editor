/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  act,
  cleanup,
  fireEvent,
  render,
  RenderResult,
  screen,
} from "@testing-library/react";
import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { GraphCanvasEvent, GraphConfigBuilder, rect } from "../../../index";
import { MouseEventButton } from "../../../lib/common/constants";
import { Item } from "../../../lib/components/ItemPanel";
import { AddingNodeSvg } from "../../../lib/components/ItemPanel/AddingNodeSvg";
import { GraphController } from "../../../lib/controllers/GraphController";
import { GraphControllerRef, TestComponent } from "../../TestComponent";
import { mockClientRect, patchPointerEvent } from "../../utils";
import { TestItemContent } from "./TestItemContent";

jest.mock("../../../lib/components/ItemPanel/useSvgRect", () => ({
  useSvgRect: () => {
    return mockClientRect;
  },
}));

describe("ItemPanel - AddingNodeSvg", () => {
  let renderedWrapper: RenderResult;
  let graphController: GraphController;
  const getElement = () => renderedWrapper.getByRole("button");

  beforeAll(() => {
    patchPointerEvent();
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    const graphConfig = GraphConfigBuilder.default()
      .registerNode("nodeShape", rect)
      .build();
    const graphControllerRef = React.createRef<GraphController>();
    const getNode = () => {
      return {
        name: "node1",
        shape: "nodeShape",
      };
    };
    renderedWrapper = render(
      <TestComponent graph={false} settings={{ graphConfig }}>
        <Item getNode={getNode} dragWillStart={jest.fn()}>
          <TestItemContent text="test item for addingNodeSVG" />
        </Item>
        <GraphControllerRef ref={graphControllerRef} />
      </TestComponent>
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    graphController = graphControllerRef.current!;
    expect(graphController).toBeDefined();
    act(() => {
      graphController.dispatch({
        type: GraphCanvasEvent.ViewportResize,
        viewportRect: mockClientRect,
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
        pointerType: "mouse",
      });
      jest.runAllTimers();
    });

    points.forEach(([clientX, clientY]) => {
      act(() => {
        fireEvent.pointerMove(window, {
          clientX,
          clientY,
          button: mouseEventButton,
          pointerType: "mouse",
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
        pointerType: "mouse",
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
          id: "mock-id",
        }}
        svgRef={React.createRef<SVGSVGElement>()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it("adding node", () => {
    simulateDragging(screen.getByRole("button"), MouseEventButton.Primary, [
      [100, 100],
      [105, 105],
    ]);

    expect(getElement()).toMatchSnapshot();
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
      y: 50,
    } as any);

    simulateDragging(screen.getByRole("button"), MouseEventButton.Primary, [
      [25, 25],
      [30, 30],
    ]);

    expect(getElement()).toMatchSnapshot();
  });

  it("without left mouse down when dragging", () => {
    simulateDragging(screen.getByRole("button"), MouseEventButton.Secondary, [
      [100, 100],
      [105, 105],
    ]);

    expect(getElement()).toMatchSnapshot();
  });
});
