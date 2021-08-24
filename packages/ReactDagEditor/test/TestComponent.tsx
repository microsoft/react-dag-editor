import * as React from "react";
import { applyDefaultPortsPosition, GraphModel, ICanvasData, IEvent, IGraphConfig, IGraphReducer } from "../src";
import { Graph, IGraphProps, ReactDagEditor } from "../src/components";
import { GraphController } from "../src/controllers/GraphController";
import { useGraphController } from "../src/hooks/context";
import { IGraphReducerInitializerParams, useGraphReducer } from "../src/hooks/useGraphReducer";
import Sample0 from "../test/unit/__data__/sample0.json";
import { defaultConfig } from "./unit/__mocks__/mockContext";

const data: ICanvasData = {
  ...Sample0,
  nodes: Sample0.nodes.map(node => ({
    ...node,
    ports: applyDefaultPortsPosition<unknown>(node.ports || [])
  }))
};

export interface ITestComponentProps {
  data?: GraphModel;
  graphConfig?: IGraphConfig;
  middleware?: IGraphReducer;
  graphProps?: Partial<IGraphProps>;
  stateProps?: Partial<IGraphReducerInitializerParams>;
  graph?: boolean;
}

let events: string[];

beforeEach(() => {
  events = [];
});

afterEach(() => {
  expect(events).toMatchSnapshot("events");
});

export const GraphControllerRef = React.forwardRef<GraphController>((_, ref) => {
  const graphController = useGraphController();
  React.useImperativeHandle(ref, () => graphController, [graphController]);
  return null;
});

const defaultData = GraphModel.fromJSON(data);

export const TestComponent = (props: React.PropsWithChildren<ITestComponentProps>) => {
  const { graphProps, stateProps, graphConfig = defaultConfig, middleware, graph = true, data = defaultData } = props;
  const onEvent = React.useCallback(
    (event: IEvent) => {
      graphProps?.onEvent?.(event);
      events.push(event.type);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphProps?.onEvent]
  );

  const [state, dispatch] = useGraphReducer(
    {
      ...stateProps,
      graphConfig,
      data
    },
    middleware
  );

  return (
    <ReactDagEditor state={state} dispatch={dispatch}>
      {graph && <Graph {...graphProps} onEvent={onEvent} />}
      {props.children}
    </ReactDagEditor>
  );
};
