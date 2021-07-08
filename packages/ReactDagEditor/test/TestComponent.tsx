import * as React from "react";
import { applyDefaultPortsPosition, GraphModel, ICanvasData, IEvent, IGraphConfig, IGraphReducer } from "../src";
import { Graph, GraphStateStore, IGraphProps, ReactDagEditor } from "../src/components";
import { GraphConfigContext } from "../src/contexts";
import { GraphControllerContext } from "../src/contexts/GraphControllerContext";
import { GraphController } from "../src/utils/graphController";
import Sample0 from "../test/unit/__data__/sample0.json";

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

export const GraphControllerRef = React.forwardRef<GraphController>((_, ref) => {
  const graphController = React.useContext(GraphControllerContext);
  React.useImperativeHandle(ref, () => graphController, [graphController]);
  return null;
});

export const TestComponent = (props: React.PropsWithChildren<ITestComponentProps>) => {
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
      {props.children}
    </GraphStateStore>
  );

  return (
    <ReactDagEditor>
      {props.graphConfig ? (
        <GraphConfigContext.Provider value={props.graphConfig}>{content}</GraphConfigContext.Provider>
      ) : (
        content
      )}
    </ReactDagEditor>
  );
};
