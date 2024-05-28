import { cleanup, fireEvent, render } from "@testing-library/react";
import * as React from "react";

import { act } from "react-dom/test-utils";
import { GraphCanvasEvent } from "../../index";
import { TestComponent } from "../TestComponent";

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    cb(0);
    return 0;
  });
});

afterEach(cleanup);

describe("Wheel", () => {
  it("should not work with wheel event without focus", () => {
    const onEvent = jest.fn();
    const { container } = render(<TestComponent graphProps={{ onEvent }} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toBeTruthy();

    document.body.focus();

    act(() => {
      fireEvent.wheel(svg, {
        deltaY: 200,
      });
      jest.runAllTimers();
    });

    expect(onEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: GraphCanvasEvent.MouseWheelScroll,
      })
    );
  });
});
