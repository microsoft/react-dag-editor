/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/display-name */
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
  getRectWidth,
  hasState,
  GraphNodeState
} from "../../src";
import { sampleGraphData } from "../data/sample-graph-1";

const stepNodeContainerStyles: React.CSSProperties = {
  flexGrow: 1,
  height: "100%",
  backgroundColor: "yellow",
  opacity: 0.5
};

const StepNode: React.FC<{ name: string }> = props => {
  return (
    <div style={stepNodeContainerStyles}>
      {props.name}
      <button
        onClick={() => {
          console.log(`this is node ${props.name}`);
        }}
      >
        Click me
      </button>
    </div>
  );
};

const sourceNodeConfig: IRectConfig<NodeModel> = {
  getMinHeight: () => 60,
  getMinWidth: () => 100,
  render(args): React.ReactNode {
    const height = getRectHeight(sourceNodeConfig, args.model);
    const width = getRectWidth(sourceNodeConfig, args.model);

    const fill = hasState(GraphNodeState.activated)(args.model.state) ? "red" : "blue";
    const stroke = hasState(GraphNodeState.selected)(args.model.state) ? "green" : "none";

    return (
      <ellipse
        rx={width / 2}
        ry={height / 2}
        cx={args.model.x + width / 2}
        cy={args.model.y + height / 2}
        stroke={stroke}
        strokeWidth={4}
        fill={fill}
        fillOpacity={0.8}
      />
    );
  }
};

const stepNodeConfig: IRectConfig<NodeModel> = {
  getMinHeight: () => 64,
  getMinWidth: model => 120 + (model.name?.length ?? 0) * 12,
  render: args => {
    const height = getRectHeight(stepNodeConfig, args.model);
    const width = getRectWidth(stepNodeConfig, args.model);

    return (
      <foreignObject
        transform={`translate(${args.model.x}, ${args.model.y})`}
        height={height}
        width={width}
        style={{ display: "flex" }}
      >
        <StepNode name={args.model.name ?? ""} />
      </foreignObject>
    );
  }
};

export const FeaturesDemo: React.FC = () => {
  return (
    <Engine style={{ width: "900px", height: "600px" }}>
      <GraphStateStore data={GraphModel.fromJSON(sampleGraphData)}>
        <RegisterNode name="source" config={sourceNodeConfig} />
        <RegisterNode name="step" config={stepNodeConfig} />
        <Graph />
      </GraphStateStore>
    </Engine>
  );
};
