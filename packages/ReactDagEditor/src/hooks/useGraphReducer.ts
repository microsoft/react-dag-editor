import * as React from "react";
import { emptyDummyNodes } from "../components/dummyNodes";
import { emptySelectBoxPosition } from "../components/Graph/SelectBox";
import { EMPTY_TRANSFORM_MATRIX, IDispatch, IDispatchCallback, IGraphReactReducer, IGraphReducer } from "../contexts";
import { ITransformMatrix } from "../models/geometry";
import { GraphModel } from "../models/GraphModel";
import { GraphBehavior, IGraphSettings, IGraphState } from "../models/state";
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
import { resetUndoStack } from "../utils";
import { batchedUpdates } from "../utils/batchedUpdates";
import { useConst } from "./useConst";

export interface IGraphReducerInitializerParams<NodeData = unknown, EdgeData = unknown, PortData = unknown>
  extends IGraphSettings<NodeData, EdgeData, PortData> {
  data?: GraphModel<NodeData, EdgeData, PortData>;
  transformMatrix?: ITransformMatrix;
}

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
    contextMenuReducer
  ].map((reducer): IGraphReducer => next => (state, action) => next(reducer(state, action), action))
);

const noopReducer: IGraphReactReducer = state => state;

export function useGraphReducer<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never>(
  params: IGraphReducerInitializerParams<NodeData, EdgeData, PortData>,
  middleware: IGraphReducer<NodeData, EdgeData, PortData, Action> | undefined
): [IGraphState<NodeData, EdgeData, PortData>, IDispatch<NodeData, EdgeData, PortData, Action>] {
  const reducer = React.useMemo(() => {
    const finalMiddleware = middleware ? composeReducers([middleware, builtinReducer]) : builtinReducer;
    return finalMiddleware(noopReducer);
  }, [middleware]);
  const [state, dispatchImpl] = React.useReducer(
    reducer,
    params,
    ({ data, transformMatrix, features, graphConfig }) => ({
      features,
      graphConfig,
      data: resetUndoStack(data ?? GraphModel.empty()),
      viewport: {
        rect: undefined,
        transformMatrix: transformMatrix ?? EMPTY_TRANSFORM_MATRIX
      },
      behavior: GraphBehavior.default,
      dummyNodes: emptyDummyNodes(),
      alignmentLines: [],
      activeKeys: new Set<string>(),
      selectBoxPosition: emptySelectBoxPosition(),
      connectState: undefined
    })
  );
  const sideEffects = useConst<IDispatchCallback[]>(() => []);
  const prevStateRef = React.useRef(state);
  const dispatch: IDispatch = React.useCallback(
    (action, callback) => {
      if (callback) {
        sideEffects.push(callback);
      }
      dispatchImpl(action);
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
      sideEffects.forEach(callback => {
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
