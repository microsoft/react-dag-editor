import * as React from "react";
import { applyDefaultPortsPosition, GraphModel, ICanvasData, IEvent, IGraphConfig, IGraphReducer } from "../src";
import { Graph, GraphStateStore, IGraphProps, Engine } from "../src/components";
import { GraphConfigContext } from "../src/contexts";
import Sample0 from "../test/unit/__data__/sampleICanvasData.json";

const data: ICanvasData = {
  ...Sample0,
  nodes: Sample0.nodes.map(node => ({
    ...node,
    ports: applyDefaultPortsPosition<unknown>(node.ports || [])
  }))
};

export interface ITestComponentProps extends Partial<IGraphProps> {
  data?: GraphModel;
  graphConfig?: IGraphConfig;
  middleware?: IGraphReducer;
}

let events: string[];

beforeEach(() => {
  events = [];
});

afterEach(() => {
  expect(events).toMatchSnapshot("events");
});

export const TestComponent = (props: ITestComponentProps) => {
  const onEvent = React.useCallback(
    (event: IEvent) => {
      props.onEvent?.(event);
      events.push(event.type);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onEvent]
  );

  const content = (
    <GraphStateStore data={props.data ?? GraphModel.fromJSON(data)} middleware={props.middleware}>
      <Graph {...props} onEvent={onEvent} />
    </GraphStateStore>
  );

  return (
    <Engine>
      {props.graphConfig ? (
        <GraphConfigContext.Provider value={props.graphConfig}>{content}</GraphConfigContext.Provider>
      ) : (
        content
      )}
    </Engine>
  );
};
