import * as React from "react";
import { EMPTY_GRAPH_STATE } from "../createGraphState";
import type { IEvent } from "../models/event";
import { GraphModel } from "../models/GraphModel";
import type { IGraphState } from "../models/state";
import { Debug } from "../utils/debug";

/**
 *
 */
function warnGraphStateContext(): void {
  Debug.warn(
    "Missing GraphStateContext, GraphStateContext must be used as child of GraphStateStore"
  );
}

export const defaultGraphStateContext: IGraphStateContext = {
  get state(): IGraphState {
    warnGraphStateContext();
    return EMPTY_GRAPH_STATE;
  },
  dispatch: () => {
    warnGraphStateContext();
  },
};

export const EMPTY_CONNECT_STATE = {
  sourceNode: undefined,
  sourcePort: undefined,
  targetNode: undefined,
  targetPort: undefined,
  movingPoint: {
    x: 0,
    y: 0,
  },
};

export type IGraphAction<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> = IEvent<NodeData, EdgeData, PortData>;

export type IDispatchCallback<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> = (
  state: IGraphState<NodeData, EdgeData, PortData>,
  prevState: IGraphState<NodeData, EdgeData, PortData>
) => void;

export type IDispatch<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never
> = (
  action: IEvent<NodeData, EdgeData, PortData> | Action,
  callback?: IDispatchCallback<NodeData, EdgeData, PortData>
) => void;

export interface IGraphStateContext<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never
> {
  state: IGraphState<NodeData, EdgeData, PortData>;
  dispatch: IDispatch<NodeData, EdgeData, PortData, Action>;
}

/**
 * use separate context for now to improve performance
 * until https://github.com/reactjs/rfcs/pull/119 or something equivalent
 */
export const GraphValueContext = React.createContext<GraphModel>(
  new Proxy(GraphModel.empty(), {
    get: (target, prop) => {
      // eslint-disable-next-line no-console
      console.warn(
        "Default graph data value is being used. Please check if you forget rendering Graph component"
      );

      return Reflect.get(target, prop);
    },
  })
);

export const GraphStateContext = React.createContext<IGraphStateContext>(
  defaultGraphStateContext
);

export type IGraphReactReducer<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never
> = React.Reducer<
  IGraphState<NodeData, EdgeData, PortData>,
  IEvent<NodeData, EdgeData, PortData> | Action
>;

export type IGraphReducer<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never
> = (
  next: IGraphReactReducer<NodeData, EdgeData, PortData, Action>
) => IGraphReactReducer<NodeData, EdgeData, PortData, Action>;

export const setData = <
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
>(
  state: IGraphState<NodeData, EdgeData, PortData>,
  data: GraphModel<NodeData, EdgeData, PortData>
): IGraphState<NodeData, EdgeData, PortData> => ({
  ...state,
  data: {
    ...state.data,
    present: data,
  },
});

export const updateData = <
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
>(
  state: IGraphState<NodeData, EdgeData, PortData>,
  f: (
    data: GraphModel<NodeData, EdgeData, PortData>
  ) => GraphModel<NodeData, EdgeData, PortData>
): IGraphState<NodeData, EdgeData, PortData> => ({
  ...state,
  data: {
    ...state.data,
    present: f(state.data.present),
  },
});
