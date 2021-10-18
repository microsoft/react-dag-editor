import { render } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";
import { Direction, GraphCanvasEvent, GraphModel, IPoint, ITransformMatrix, IViewport } from "../../index";
import { Transform } from "../../src/components/Transform";
import { GraphController } from "../../src/controllers/GraphController";
import { getRenderedEdges, getRenderedNodes } from "../../src/utils/viewport";
import { GraphControllerRef, TestComponent } from "../TestComponent";
import { getGraphConfig, mockBoundingBox } from "../utils";
import { getSample1Data } from "./__data__/getSample1Data";

describe("viewport", () => {
  const rect: DOMRect | ClientRect = {
    bottom: 816,
    height: 800,
    left: 316,
    right: 1232,
    top: 16,
    width: 916,
    x: 316,
    y: 16
  };
  const data = getSample1Data();
  const viewport = (transformMatrix: ITransformMatrix): Required<IViewport> => ({
    transformMatrix,
    rect
  });

  it("getRenderedNodes", () => {
    const renderedNodes = getRenderedNodes(GraphModel.fromJSON(data).nodes, viewport([1, 0, 0, 1, 0, 0]));
    expect(renderedNodes.length).toBe(8);

    const renderedNodes2 = getRenderedNodes(
      GraphModel.fromJSON(data).nodes,
      viewport([4.77, 0, 0, 4.77, -2281.56, -1995.55])
    );
    expect(renderedNodes2.length).toBe(5);
  });

  it("getRenderedEdges", () => {
    const { nodes, edges } = GraphModel.fromJSON(data);
    const graphConfig = getGraphConfig();

    const renderedEdges = getRenderedEdges(edges, nodes, graphConfig, viewport([1, 0, 0, 1, 0, 0]));
    expect(renderedEdges.length).toBe(8);

    const renderedEdges2 = getRenderedEdges(
      edges,
      nodes,
      graphConfig,
      viewport([4.77, 0, 0, 4.77, -2281.56, -1995.55])
    );
    expect(renderedEdges2.length).toBe(7);
  });
});

describe("test zoom", () => {
  let graphController: GraphController;
  function zoom(scale: number, direction?: Direction): void {
    return graphController.dispatch({
      type: GraphCanvasEvent.Zoom,
      scale,
      direction
    });
  }
  function zoomTo(scale: number, anchor?: IPoint | undefined, direction?: Direction): void {
    graphController.dispatch({
      type: GraphCanvasEvent.ZoomTo,
      scale,
      anchor,
      direction
    });
  }
  const getViewport = () => graphController.state.viewport;

  beforeEach(() => {
    mockBoundingBox();
    const graphControllerRef = React.createRef<GraphController>();
    render(
      <TestComponent>
        <GraphControllerRef ref={graphControllerRef} />
      </TestComponent>
    );
    graphController = graphControllerRef.current!;
    expect(graphController).toBeDefined();
  });

  it("should zoom x,y", () => {
    act(() => {
      zoom(2);
    });
    let transformMatrix = getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(2);
    expect(transformMatrix[3]).toBe(2);

    act(() => {
      zoomTo(3);
    });
    transformMatrix = getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(3);
    expect(transformMatrix[3]).toBe(3);
  });

  it("should zoom x only", () => {
    act(() => {
      zoom(2, Direction.X);
    });
    let transformMatrix = getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(2);
    expect(transformMatrix[3]).toBe(1);

    act(() => {
      zoomTo(3, undefined, Direction.X);
    });
    transformMatrix = getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(3);
    expect(transformMatrix[3]).toBe(1);
  });

  it("should zoom y only", () => {
    act(() => {
      zoom(2, Direction.Y);
    });
    let transformMatrix = getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(1);
    expect(transformMatrix[3]).toBe(2);

    act(() => {
      zoomTo(3, undefined, Direction.Y);
    });
    transformMatrix = getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(1);
    expect(transformMatrix[3]).toBe(3);
  });
});

describe("test Transform", () => {
  it("should get correct transform", () => {
    expect(render(<Transform matrix={[1, 0, 0, 1, 0, 0]} />).container).toMatchSnapshot();
  });
});
