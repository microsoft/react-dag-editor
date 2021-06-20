/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, cleanup, fireEvent, render, RenderResult, screen } from "@testing-library/react";
import * as React from "react";
import { defaultFeatures, GraphModel, GraphStateStore, IGraphAction, useGraphState } from "../../../src";
import { Item } from "../../../src/components/ItemPanel";
import { noopInstance } from "../../../src/props-api/IPropsAPIInstance";
import { graphController } from "../../../src/utils/graphController";
import { patchPointerEvent } from "../../utils";
import { withGraphConfigContext } from "../__mocks__/mockContext";
import { TestItemContent } from "./TestItemContent";

const rect = {
  left: 100,
  top: 100,
  width: 800,
  height: 800
};

jest.mock("../../../src/components/ItemPanel/useSvgRect", () => ({
  useSvgRect: () => {
    return rect;
  }
}));

describe("ItemPanel - Item", () => {
  let dragWillStart: () => void;
  let renderedWrapper: RenderResult;
  let dispatch: React.Dispatch<IGraphAction>;

  const HackDispatch = () => {
    const stateContext = useGraphState();
    dispatch = stateContext.dispatch;
    return null;
  };

  beforeAll(() => {
    jest.useFakeTimers();
    patchPointerEvent();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(graphController, "getEnabledFeatures").mockReturnValue(defaultFeatures);
    dragWillStart = jest.fn();
    renderedWrapper = render(
      withGraphConfigContext(
        <GraphStateStore data={GraphModel.empty()}>
          <HackDispatch />
          <Item
            model={{ name: "node1", shape: "nodeShape" }}
            dragWillStart={dragWillStart}
            nodeWillAdd={jest.fn()}
            nodeDidAdd={jest.fn()}
          >
            <TestItemContent text="test item" />
          </Item>
        </GraphStateStore>
      )
    );
  });

  afterEach(cleanup);

  it("Should work well when mousedown and mouseup", () => {
    noopInstance.containerRectRef = {
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

    (noopInstance.eventChannel.listenersRef as any).current = [dispatch];

    const { container } = renderedWrapper;

    expect(container).toMatchSnapshot();

    // when mouse down
    act(() => {
      fireEvent.pointerDown(screen.getByRole("button"));
    });
    expect(dragWillStart).toBeCalled();
    expect(container).toMatchSnapshot();

    // when mouse up
    act(() => {
      jest.runAllTimers();
      fireEvent.pointerUp(window);
    });
    expect(container).toMatchSnapshot();
  });
});
