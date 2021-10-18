import { render } from "@testing-library/react";
import * as React from "react";
import { EMPTY_GRAPH_STATE, IEvent, IGraphState, IViewport } from "../../index";
import { Scrollbar } from "../../lib/components/Scrollbar";
import { viewportReducer } from "../../lib/reducers/viewportReducer";
import { EventChannel } from "../../lib/utils/eventChannel";

describe("Scrollbar", () => {
  const ScrollbarComponent = () => {
    const rect: DOMRect | ClientRect = {
      width: 800,
      height: 600,
      left: 0,
      top: 0,
      right: 800,
      bottom: 800,
    };

    const [, dispatch] = React.useReducer(
      (prev: IGraphState, action: IEvent) => {
        return viewportReducer(prev, action);
      },
      {
        ...EMPTY_GRAPH_STATE,
      }
    );

    const viewport: Required<IViewport> = {
      rect,
      transformMatrix: [1, 0, 0, 1, 0, 0],
    };

    return (
      <Scrollbar
        viewport={viewport}
        offsetLimit={{ minX: -30, maxX: 20, minY: -100, maxY: 100 }}
        dispatch={dispatch}
        horizontal={true}
        vertical={true}
        eventChannel={new EventChannel()}
      />
    );
  };

  it("should match the snapshot", () => {
    const { container } = render(<ScrollbarComponent />);
    expect(container).toMatchSnapshot();
  });
});
