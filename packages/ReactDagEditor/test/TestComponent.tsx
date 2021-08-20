import * as React from "react";
import {
  applyDefaultPortsPosition,
  GraphModel,
  ICanvasData,
  IEvent,
  IGraphConfig,
  IGraphReducer,
  IGraphStateStoreProps
} from "../src";
import { Graph, GraphStateStore, IGraphProps, ReactDagEditor } from "../src/components";
import { GraphConfigContext } from "../src/contexts";
import { GraphController } from "../src/controllers/GraphController";
import { useGraphController } from "../src/hooks/context";
import Sample0 from "../test/unit/__data__/sample0.json";

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
  stateProps?: Partial<IGraphStateStoreProps>;
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

export const TestComponent = (props: React.PropsWithChildren<ITestComponentProps>) => {
  const { graphProps, stateProps } = props;
  const onEvent = React.useCallback(
    (event: IEvent) => {
      graphProps?.onEvent?.(event);
      events.push(event.type);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphProps?.onEvent]
  );
  const {} = props;

  const content = (
    <GraphStateStore {...stateProps} data={props.data ?? GraphModel.fromJSON(data)} middleware={props.middleware}>
      <Graph {...graphProps} onEvent={onEvent} />
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
