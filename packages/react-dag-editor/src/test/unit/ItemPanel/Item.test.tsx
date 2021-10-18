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
import {
  GraphCanvasEvent,
  GraphConfigBuilder,
  GraphModel,
  rect,
} from "../../../index";
import { Item } from "../../../src/components/ItemPanel";
import { GraphController } from "../../../src/controllers/GraphController";
import { GraphControllerRef, TestComponent } from "../../TestComponent";
import { mockClientRect, patchPointerEvent } from "../../utils";
import { TestItemContent } from "./TestItemContent";

jest.mock("../../../src/components/ItemPanel/useSvgRect", () => ({
  useSvgRect: () => {
    return mockClientRect;
  },
}));

describe("ItemPanel - Item", () => {
  let dragWillStart: () => void;
  let renderedWrapper: RenderResult;
  let graphController: GraphController;
  const getElement = () => renderedWrapper.getByRole("button");

  beforeAll(() => {
    jest.useFakeTimers();
    patchPointerEvent();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    dragWillStart = jest.fn();
    const graphConfig = GraphConfigBuilder.default()
      .registerNode("nodeShape", rect)
      .build();
    const graphControllerRef = React.createRef<GraphController>();
    renderedWrapper = render(
      <TestComponent
        data={GraphModel.empty()}
        graph={false}
        settings={{ graphConfig }}
      >
        <Item
          model={{ name: "node1", shape: "nodeShape" }}
          dragWillStart={dragWillStart}
          nodeWillAdd={jest.fn()}
          nodeDidAdd={jest.fn()}
        >
          <TestItemContent text="test item" />
        </Item>
        <GraphControllerRef ref={graphControllerRef} />
      </TestComponent>
    );
    graphController = graphControllerRef.current!;
    expect(graphController).toBeDefined();
    act(() => {
      graphController.dispatch({
        type: GraphCanvasEvent.ViewportResize,
        viewportRect: mockClientRect,
      });
    });
    (graphController.eventChannel.listenersRef as any).current =
      graphController.dispatch;
  });

  afterEach(cleanup);

  it("Should work well when mousedown and mouseup", () => {
    expect(getElement()).toMatchSnapshot();

    // when mouse down
    act(() => {
      fireEvent.pointerDown(screen.getByRole("button"));
    });
    expect(dragWillStart).toBeCalled();
    expect(getElement()).toMatchSnapshot();

    // when mouse up
    act(() => {
      jest.runAllTimers();
      fireEvent.pointerUp(window);
    });
    expect(getElement()).toMatchSnapshot();
  });
});
