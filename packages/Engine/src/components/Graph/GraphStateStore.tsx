/* eslint-disable import/no-deprecated */
import * as React from "react";
import { GraphCanvasEvent } from "../../common/GraphEvent.constant";
import { ConnectingState } from "../../ConnectingState";
import {
  GraphConfigContext,
  IGraphReducer,
  IGraphReducerContext,
  ViewPortContext
} from "../../contexts";
import { AlignmentLinesContext } from "../../contexts/AlignmentLinesContext";
import { AutoZoomFitContext } from "../../contexts/AutoZoomFitContext";
import {
  GraphBehavior,
  GraphStateContext,
  GraphValueContext,
  IDispatch,
  IDispatchCallback
} from "../../contexts/GraphStateContext";
import { GraphFeatures } from "../../Features";

import { usePropsAPI } from "../../hooks/usePropsAPI";
import { GraphModel } from "../../models/GraphModel";
import { DEFAULT_TRANSFORM_MATRIX, ITransformMatrix } from "../../models/viewport";
import { IPropsAPI } from "../../props-api/IPropsAPI";
import { useGraphReducer } from "../../reducers/useGraphReducer";
import { isViewPortComplete, resetUndoStack } from "../../utils";
import { batchedUpdates } from "../../utils/batchedUpdates";
import { graphController } from "../../utils/graphController";
import { emptyDummyNodes } from "../dummyNodes";
import { emptySelectBoxPosition } from "./SelectBox";

export interface IGraphStateStoreProps<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never> {
  /**
   * The propsAPI reference.
   */
  propsAPIRef?: React.Ref<IPropsAPI<NodeData, EdgeData, PortData> | null>;
  /**
   * the initial graph data model.
   */
  data?: GraphModel<NodeData, EdgeData, PortData>;
  defaultTransformMatrix?: ITransformMatrix;
  middleware?: IGraphReducer<NodeData, EdgeData, PortData, Action>;
  onStateChanged?: IDispatchCallback<NodeData, EdgeData, PortData>;
}

export function GraphStateStore<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never>(
  props: React.PropsWithChildren<IGraphStateStoreProps<NodeData, EdgeData, PortData, Action>>
): React.ReactElement {
  const { defaultTransformMatrix = DEFAULT_TRANSFORM_MATRIX, middleware, onStateChanged } = props;

  const propsAPI = usePropsAPI<NodeData, EdgeData, PortData>();
  React.useImperativeHandle(props.propsAPIRef, () => propsAPI, [propsAPI]);

  const graphConfig = React.useContext(GraphConfigContext);
  const enabledFeatures = propsAPI.getEnabledFeatures();
  const reducerContext: IGraphReducerContext = React.useMemo(
    () => ({
      graphConfig,
      features: enabledFeatures
    }),
    [enabledFeatures, graphConfig]
  );
  const reducer = useGraphReducer(reducerContext, middleware as IGraphReducer);

  const [state, dispatchImpl] = React.useReducer(reducer, undefined, () => ({
    data: resetUndoStack(props.data ?? GraphModel.empty()),
    viewport: {
      rect: undefined,
      transformMatrix: defaultTransformMatrix
    },
    behavior: GraphBehavior.default,
    dummyNodes: emptyDummyNodes(),
    alignmentLines: [],
    activeKeys: new Set<string>(),
    selectBoxPosition: emptySelectBoxPosition(),
    connectState: undefined
  }));

  const sideEffects = React.useMemo<IDispatchCallback[]>(() => [], []);
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
    if (onStateChanged) {
      sideEffects.unshift(onStateChanged);
    }
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
  });

  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch
    }),
    [state, dispatch]
  );

  /**
   * GraphNode useLayoutEffect shouldAutoZoomToFit.current = true
   * then useEffect here fired
   */
  const shouldAutoZoomToFit = React.useRef(false);
  React.useEffect((): void => {
    if (!isViewPortComplete(state.viewport) || !shouldAutoZoomToFit.current) {
      return;
    }
    shouldAutoZoomToFit.current = false;
    if (!graphController.getEnabledFeatures().has(GraphFeatures.autoFit)) {
      return;
    }
    dispatch({
      type: GraphCanvasEvent.ZoomToFit
    });
  });

  return (
    <AutoZoomFitContext.Provider value={shouldAutoZoomToFit}>
      <ConnectingState data={state.data.present} connectState={state.connectState}>
        <GraphStateContext.Provider value={contextValue}>
          <ViewPortContext.Provider value={state.viewport}>
            <GraphValueContext.Provider value={state.data.present}>
              <AlignmentLinesContext.Provider value={state.alignmentLines}>
                {props.children}
              </AlignmentLinesContext.Provider>
            </GraphValueContext.Provider>
          </ViewPortContext.Provider>
        </GraphStateContext.Provider>
      </ConnectingState>
    </AutoZoomFitContext.Provider>
  );
}
