import { cleanup, fireEvent, render } from "@testing-library/react";
import * as React from "react";

import { act } from "react-dom/test-utils";
import { GraphCanvasEvent } from "../../src";
import { TestComponent } from "../TestComponent";

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
    cb(0);
    return 0;
  });
});

afterEach(cleanup);

describe("Wheel", () => {
  it("should work with wheel event after focus graph", () => {
    const onEvent = jest.fn();
    const { container } = render(<TestComponent onEvent={onEvent} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toBeTruthy();

    svg.focus();

    act(() => {
      fireEvent.wheel(svg, {
        deltaY: 200
      });
      jest.runAllTimers();
    });
  
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: GraphCanvasEvent.MouseWheelScroll
      })
    );
  });

  it("should not work with wheel event without focus", () => {
    const onEvent = jest.fn();
    const { container } = render(<TestComponent onEvent={onEvent} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toBeTruthy();

    document.body.focus();

    act(() => {
      fireEvent.wheel(svg, {
        deltaY: 200
      });
      jest.runAllTimers();
    });
  
    expect(onEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: GraphCanvasEvent.MouseWheelScroll
      })
    );
  });
})