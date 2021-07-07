import { render } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";
import { GraphModel, IPropsAPI} from "../../src";
import { Transform } from "../../src/components/Transform";
import { getRenderedEdges, getRenderedNodes } from "../../src/utils/viewport";
import { TestComponent } from "../TestComponent";
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
    rect,
    visibleRect: rect
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
  let propsAPI: IPropsAPI;

  beforeEach(() => {
    mockBoundingBox();
    const propsAPIRef = React.createRef<IPropsAPI>();
    render(<TestComponent propsAPIRef={propsAPIRef} />);
    if (!propsAPIRef.current) {
      throw new Error();
    }
    propsAPI = propsAPIRef.current;
  });

  it("should zoom x,y", () => {
    act(() => {
      propsAPI.zoom(2);
    });
    let transformMatrix = propsAPI.getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(2);
    expect(transformMatrix[3]).toBe(2);

    act(() => {
      propsAPI.zoomTo(3);
    });
    transformMatrix = propsAPI.getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(3);
    expect(transformMatrix[3]).toBe(3);
  });

  it("should zoom x only", () => {
    act(() => {
      propsAPI.zoom(2, ZoomDirection.X);
    });
    let transformMatrix = propsAPI.getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(2);
    expect(transformMatrix[3]).toBe(1);

    act(() => {
      propsAPI.zoomTo(3, undefined, ZoomDirection.X);
    });
    transformMatrix = propsAPI.getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(3);
    expect(transformMatrix[3]).toBe(1);
  });

  it("should zoom y only", () => {
    act(() => {
      propsAPI.zoom(2, ZoomDirection.Y);
    });
    let transformMatrix = propsAPI.getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(1);
    expect(transformMatrix[3]).toBe(2);

    act(() => {
      propsAPI.zoomTo(3, undefined, ZoomDirection.Y);
    });
    transformMatrix = propsAPI.getViewport().transformMatrix;
    expect(transformMatrix[0]).toBe(1);
    expect(transformMatrix[3]).toBe(3);
  });
});

describe("test Transform", () => {
  it("should get correct transform", () => {
    expect(render(<Transform matrix={[1, 0, 0, 1, 0, 0]} />).container).toMatchSnapshot();
  });
});
