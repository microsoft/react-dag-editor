import * as React from "react";
import { ConnectingState } from "../../ConnectingState";
import { EMPTY_GAP, EMPTY_TRANSFORM_MATRIX, GraphConfigContext, IGraphReducer, ViewportContext } from "../../contexts";
import { AlignmentLinesContext } from "../../contexts/AlignmentLinesContext";
import { AutoZoomFitContext } from "../../contexts/AutoZoomFitContext";
import { GraphControllerContext } from "../../contexts/GraphControllerContext";
import { GraphStateContext, GraphValueContext } from "../../contexts/GraphStateContext";
import { defaultFeatures, GraphFeatures } from "../../Features";
import { useConst } from "../../hooks/useConst";
import { useGraphReducer } from "../../hooks/useGraphReducer";
import { GraphCanvasEvent } from "../../models/event";
import { IGap, ITransformMatrix } from "../../models/geometry";
import { GraphModel } from "../../models/GraphModel";
import { isViewportComplete } from "../../utils";
import { GraphController } from "../../controllers/GraphController";

export interface IGraphStateStoreProps<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never> {
  /**
   * the initial graph data model.
   */
  data?: GraphModel<NodeData, EdgeData, PortData>;
  defaultTransformMatrix?: ITransformMatrix;
  middleware?: IGraphReducer<NodeData, EdgeData, PortData, Action>;
  features?: ReadonlySet<GraphFeatures>;
  canvasBoundaryPadding?: IGap;
}

export function GraphStateStore<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never>(
  props: React.PropsWithChildren<IGraphStateStoreProps<NodeData, EdgeData, PortData, Action>>
): React.ReactElement {
  const {
    defaultTransformMatrix = EMPTY_TRANSFORM_MATRIX,
    middleware,
    features = defaultFeatures,
    canvasBoundaryPadding = EMPTY_GAP
  } = props;

  const graphConfig = React.useContext(GraphConfigContext);

  const [state, dispatch] = useGraphReducer(
    {
      data: props.data,
      transformMatrix: defaultTransformMatrix,
      graphConfig,
      features,
      canvasBoundaryPadding,
      nodeMinVisibleSize: {
        width: 5,
        height: 5
      },
      nodeMaxVisibleSize: {
        width: Infinity,
        height: Infinity
      }
    },
    middleware
  );

  const graphController = useConst(() => new GraphController(state, dispatch));
  graphController.UNSAFE_latestState = state;
  React.useLayoutEffect(() => {
    graphController.state = state;
    graphController.dispatch = dispatch;
    // TODO: fix the next line after state is lifted and everything is merged into top level `ReactDagEditor`
    // graphController.globalEventTargetRef = globalEventTargetRef;
  }, [dispatch, graphController, state]);

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
    if (!isViewportComplete(state.viewport) || !shouldAutoZoomToFit.current) {
      return;
    }
    shouldAutoZoomToFit.current = false;
    if (!state.settings.features.has(GraphFeatures.autoFit)) {
      return;
    }
    dispatch({
      type: GraphCanvasEvent.ZoomToFit
    });
  });

  return (
    <GraphControllerContext.Provider value={graphController}>
      <AutoZoomFitContext.Provider value={shouldAutoZoomToFit}>
        <ConnectingState data={state.data.present} connectState={state.connectState}>
          <GraphStateContext.Provider value={contextValue}>
            <ViewportContext.Provider value={state.viewport}>
              <GraphValueContext.Provider value={state.data.present}>
                <AlignmentLinesContext.Provider value={state.alignmentLines}>
                  {props.children}
                </AlignmentLinesContext.Provider>
              </GraphValueContext.Provider>
            </ViewportContext.Provider>
          </GraphStateContext.Provider>
        </ConnectingState>
      </AutoZoomFitContext.Provider>
    </GraphControllerContext.Provider>
  );
}
