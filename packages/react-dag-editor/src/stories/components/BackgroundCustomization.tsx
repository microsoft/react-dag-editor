import * as React from "react";
import {
  Graph,
  GraphModel,
  GridBackground,
  ReactDagEditor,
  useBackgroundRect,
  useGraphReducer,
} from "../../";
import { sampleGraphData } from "../data/sample-graph-1";
import { graphConfig } from "./FeaturesDemo";

export const BackgroundCustomization: React.FC = () => {
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig,
      },
      data: GraphModel.fromJSON(sampleGraphData),
    },
    undefined
  );

  const { rect } = useBackgroundRect(state);

  return (
    <ReactDagEditor
      style={{ width: "900px", height: "600px" }}
      state={state}
      dispatch={dispatch}
    >
      <Graph
        background={
          <GridBackground
            rect={rect}
            smallGridAttributes={{ stroke: "green" }}
            gridAttributes={{ stroke: "yellow" }}
          />
        }
      />
    </ReactDagEditor>
  );
};
