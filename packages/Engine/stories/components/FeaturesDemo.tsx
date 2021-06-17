import * as React from "react";
import { Engine, Graph, GraphStateStore, GraphModel } from "../../src";
import { sampleGraphData } from "../data/sample-graph-1";

export const FeaturesDemo: React.FC = () => {
  return (
    <Engine>
      <GraphStateStore data={GraphModel.fromJSON(sampleGraphData)}>
        <Graph />
      </GraphStateStore>
    </Engine>
  );
};
