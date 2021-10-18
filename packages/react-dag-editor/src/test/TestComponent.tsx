import * as React from "react";
import { applyDefaultPortsPosition, GraphModel, ICanvasData, IEvent, IGraphReducer, IGraphSettings } from "../index";
import { Graph, IGraphProps, ReactDagEditor } from "../src/components";
import { GraphController } from "../src/controllers/GraphController";
import { useGraphController } from "../src/hooks/context";
import { useGraphReducer } from "../src/hooks/useGraphReducer";
import Sample0 from "./unit/__data__/sample0.json";
import { defaultConfig } from "./unit/__mocks__/mockContext";

const data: ICanvasData = {
  ...Sample0,
  nodes: Sample0.nodes.map((node) => ({
    ...node,
    ports: applyDefaultPortsPosition<unknown>(node.ports || []),
  })),
};

export interface ITestComponentProps {
  data?: GraphModel;
  middleware?: IGraphReducer;
  graphProps?: Partial<IGraphProps>;
  graph?: boolean;
  settings?: Partial<IGraphSettings>;
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
  const { graphProps, settings, middleware, graph = true, data = defaultData } = props;
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
      settings: {
        graphConfig: defaultConfig,
        ...settings,
      },
      data,
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
