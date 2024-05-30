import * as React from "react";
import { Graph, GraphModel, ReactDagEditor, useGraphReducer } from "../..";
import { INodeFrameProps, INodeResizeHandlerProps } from "../../lib/contexts/SlotsContext";
import { sampleGraphData } from "../data/sample-graph-1";
import { graphConfig } from "./FeaturesDemo";

export const NodeFrameCustomization: React.FC = () => {
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig,
      },
      data: GraphModel.fromJSON(sampleGraphData),
    },
    undefined,
  );

  const renderNodeFrame = React.useCallback(({ height, width, x, y }: INodeFrameProps) => {
    return (
      <rect
        transform={`translate(${x},${y})`}
        height={height}
        width={width}
        stroke={"blue"}
        strokeDasharray="4"
        fill="red"
      />
    );
  }, []);

  return (
    <ReactDagEditor
      style={{ width: "900px", height: "600px" }}
      state={state}
      dispatch={dispatch}
      renderNodeFrame={renderNodeFrame}
    >
      <Graph />
    </ReactDagEditor>
  );
};

export const NodeResizeHandlerCustomization: React.FC = () => {
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig,
      },
      data: GraphModel.fromJSON(sampleGraphData),
    },
    undefined,
  );

  const renderNodeResizeHandler = React.useCallback(({ x, y, cursor, onMouseDown }: INodeResizeHandlerProps) => {
    return <circle cx={x} cy={y} r={4} fill="green" cursor={cursor} onMouseDown={onMouseDown} />;
  }, []);

  return (
    <ReactDagEditor
      style={{ width: "900px", height: "600px" }}
      state={state}
      dispatch={dispatch}
      renderNodeResizeHandler={renderNodeResizeHandler}
    >
      <Graph />
    </ReactDagEditor>
  );
};
