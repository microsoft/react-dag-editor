import * as React from "react";
import {
  IDispatch,
  IDispatchCallback,
  IGraphAction,
  IGraphReducer,
  IGraphMiddleware,
} from "../contexts";
import { createGraphState } from "../createGraphState";
import { IGraphReducerInitializerParams, IGraphState } from "../models/state";
import { behaviorReducer } from "../reducers/behaviorReducer";
import { canvasReducer } from "../reducers/canvasReducer";
import { composeReducers } from "../reducers/composeReducers";
import { connectingReducer } from "../reducers/connectingReducer";
import { contextMenuReducer } from "../reducers/contextMenuReducer";
import { edgeReducer } from "../reducers/edgeReducer";
import { nodeReducer } from "../reducers/nodeReducer";
import { portReducer } from "../reducers/portReducer";
import { selectionReducer } from "../reducers/selectionReducer";
import { viewportReducer } from "../reducers/viewportReducer";
import { batchedUpdates } from "../utils/batchedUpdates";
import { identical } from "../utils/identical";
import { useConst } from "./useConst";

const builtinReducer = composeReducers(
  [
    behaviorReducer,
    viewportReducer,
    nodeReducer,
    portReducer,
    edgeReducer,
    canvasReducer,
    connectingReducer,
    selectionReducer,
    contextMenuReducer,
  ].map(
    (reducer): IGraphMiddleware =>
      (next) =>
      (state, action) =>
        next(reducer(state, action), action)
  )
);

export function getGraphReducer<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never
>(
  middleware:
    | IGraphMiddleware<NodeData, EdgeData, PortData, Action>
    | undefined = undefined,
  finalReducer: IGraphReducer<NodeData, EdgeData, PortData, Action> = identical
): IGraphReducer<NodeData, EdgeData, PortData, Action> {
  const finalMiddleware = middleware
    ? composeReducers([middleware as IGraphMiddleware, builtinReducer])
    : builtinReducer;
  return finalMiddleware(finalReducer as IGraphReducer) as IGraphReducer<
    NodeData,
    EdgeData,
    PortData,
    Action
  >;
}

export function useGraphReducer<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never
>(
  params: IGraphReducerInitializerParams<NodeData, EdgeData, PortData>,
  middleware: IGraphMiddleware<NodeData, EdgeData, PortData, Action> | undefined
): [
  IGraphState<NodeData, EdgeData, PortData>,
  IDispatch<NodeData, EdgeData, PortData, Action>
] {
  const reducer = React.useMemo(
    () => getGraphReducer(middleware),
    [middleware]
  );
  const [state, dispatchImpl] = React.useReducer(
    reducer,
    params,
    createGraphState
  );
  const sideEffects = useConst<IDispatchCallback[]>(() => []);
  const prevStateRef = React.useRef(state);
  const dispatch: IDispatch = React.useCallback(
    (action, callback) => {
      if (callback) {
        sideEffects.push(callback);
      }
      dispatchImpl(
        action as Action | IGraphAction<NodeData, EdgeData, PortData>
      );
    },
    [sideEffects]
  );
  React.useEffect((): void => {
    const prevState = prevStateRef.current;
    if (prevState === state) {
      return;
    }
    prevStateRef.current = state;
    batchedUpdates(() => {
      sideEffects.forEach((callback) => {
        try {
          callback(state, prevState);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      });
      sideEffects.length = 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return [state, dispatch] as [
    IGraphState<NodeData, EdgeData, PortData>,
    IDispatch<NodeData, EdgeData, PortData, Action>
  ];
}
