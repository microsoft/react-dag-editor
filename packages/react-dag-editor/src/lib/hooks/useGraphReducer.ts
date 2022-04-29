import * as React from "react";
import {
  IDispatch,
  IDispatchCallback,
  IGraphAction,
  IGraphReactReducer,
  IGraphReducer,
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
    (reducer): IGraphReducer =>
      (next) =>
      (state, action) =>
        next(reducer(state, action), action)
  )
);

export function getGraphReducer<Action = never>(
  middleware: IGraphReducer<Action> | undefined = undefined,
  finalReducer: IGraphReactReducer<Action> = identical
): IGraphReactReducer<Action> {
  const finalMiddleware = middleware
    ? composeReducers([middleware as unknown as IGraphReducer, builtinReducer])
    : builtinReducer;
  return finalMiddleware(
    finalReducer as IGraphReactReducer
  ) as IGraphReactReducer<Action>;
}

export function useGraphReducer<Action = never>(
  params: IGraphReducerInitializerParams,
  middleware: IGraphReducer<Action> | undefined
): [IGraphState, IDispatch<Action>] {
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
      dispatchImpl(action as Action | IGraphAction);
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
          callback(state as IGraphState, prevState as IGraphState);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      });
      sideEffects.length = 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return [state, dispatch] as [IGraphState, IDispatch<Action>];
}
