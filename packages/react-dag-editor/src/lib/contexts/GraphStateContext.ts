import * as React from "react";
import { EMPTY_GRAPH_STATE } from "../createGraphState";
import { ContentState } from "../models/ContentState";
import type { IEvent } from "../models/event";
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

export type IGraphAction = IEvent;

export type IDispatchCallback = (
  state: IGraphState,
  prevState: IGraphState
) => void;

export type IDispatch<Action = never> = (
  action: IEvent | Action,
  callback?: IDispatchCallback
) => void;

export interface IGraphStateContext<Action = never> {
  state: IGraphState;
  dispatch: IDispatch<Action>;
}

/**
 * use separate context for now to improve performance
 * until https://github.com/reactjs/rfcs/pull/119 or something equivalent
 */
export const GraphValueContext = React.createContext<ContentState>(
  new Proxy(ContentState.empty(), {
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

export type IGraphReducer<Action = never> = React.Reducer<
  IGraphState,
  IEvent | Action
>;

export type IGraphMiddleware<Action = never> = (
  next: IGraphReducer<Action>
) => IGraphReducer<Action>;

export const setData = (
  state: IGraphState,
  data: ContentState
): IGraphState => ({
  ...state,
  data: {
    ...state.data,
    present: data,
  },
});

export const updateData = (
  state: IGraphState,
  f: (data: ContentState) => ContentState
): IGraphState => ({
  ...state,
  data: {
    ...state.data,
    present: f(state.data.present),
  },
});
