import * as React from "react";
import {
  Engine,
  Graph,
  GraphStateStore,
  GraphModel,
  RegisterNode,
  IRectConfig,
  NodeModel,
  getRectHeight,
  getRectWidth
} from "../../src";
import { sampleGraphData } from "../data/sample-graph-1";

const sourceNodeConfig: IRectConfig<NodeModel> = {
  getMinHeight: () => 60,
  getMinWidth: () => 100,
  render(args): React.ReactNode {
    const height = getRectHeight(sourceNodeConfig, args.model);
    const width = getRectWidth(sourceNodeConfig, args.model);

    return (
      <ellipse
        rx={width / 2}
        ry={height / 2}
        cx={args.model.x + width / 2}
        cy={args.model.y + height / 2}
        stroke="blue"
        fill="blue"
        fillOpacity={0.8}
      />
    );
  }
};

export const FeaturesDemo: React.FC = () => {
  return (
    <Engine style={{ width: "900px", height: "600px" }}>
      <GraphStateStore data={GraphModel.fromJSON(sampleGraphData)}>
        <RegisterNode name="source" config={sourceNodeConfig} />
        <Graph />
      </GraphStateStore>
    </Engine>
  );
};
