import * as React from "react";
import { IGraphReactReducer, IGraphReducer, IGraphReducerContext } from "../contexts";
import { behaviorReducer } from "./behaviorReducer";
import { canvasReducer } from "./canvasReducer";
import { composeReducers } from "./composeReducers";
import { connectingReducer } from "./connectingReducer";
import { contextMenuReducer } from "./contextMenuReducer";
import { edgeReducer } from "./edgeReducer";
import { nodeReducer } from "./nodeReducer";
import { portReducer } from "./portReducer";
import { selectionReducer } from "./selectionReducer";
import { viewPortReducer } from "./viewPortReducer";

const builtinReducer = composeReducers(
  [
    behaviorReducer,
    viewPortReducer,
    nodeReducer,
    portReducer,
    edgeReducer,
    canvasReducer,
    connectingReducer,
    selectionReducer,
    contextMenuReducer
  ].map((reducer): IGraphReducer => (next, context) => (state, action) => next(reducer(state, action, context), action))
);

const noopReducer: IGraphReactReducer = state => state;

export function useGraphReducer(
  context: IGraphReducerContext,
  middleware: IGraphReducer | undefined
): IGraphReactReducer {
  return React.useMemo(() => {
    const reducer = middleware ? composeReducers([middleware, builtinReducer]) : builtinReducer;
    return reducer(noopReducer, context);
  }, [context, middleware]);
}
