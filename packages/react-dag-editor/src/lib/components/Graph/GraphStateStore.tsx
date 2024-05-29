import * as React from "react";
import { ConnectingState } from "../../ConnectingState";
import { GraphConfigContext, IDispatch, ViewportContext } from "../../contexts";
import { AlignmentLinesContext } from "../../contexts/AlignmentLinesContext";
import { GraphControllerContext } from "../../contexts/GraphControllerContext";
import { GraphStateContext, GraphValueContext, IGraphStateContext } from "../../contexts/GraphStateContext";
import type { GraphController } from "../../controllers/GraphController";
import type { IGraphState } from "../../models/state";

export interface IGraphStateStoreProps<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never> {
  state: IGraphState<NodeData, EdgeData, PortData>;
  dispatch: IDispatch<NodeData, EdgeData, PortData, Action>;
  graphController: GraphController;
}

export function GraphStateStore<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never>(
  props: React.PropsWithChildren<IGraphStateStoreProps<NodeData, EdgeData, PortData, Action>>,
): React.ReactElement {
  const { graphController, state, dispatch, children } = props;
  const contextValue = React.useMemo<IGraphStateContext<NodeData, EdgeData, PortData, Action>>(
    () => ({
      state: state,
      dispatch,
    }),
    [state, dispatch],
  );

  return (
    <GraphConfigContext.Provider value={state.settings.graphConfig}>
      <GraphControllerContext.Provider value={graphController}>
        <ConnectingState data={state.data.present} connectState={state.connectState}>
          <GraphStateContext.Provider value={contextValue as IGraphStateContext}>
            <ViewportContext.Provider value={state.viewport}>
              <GraphValueContext.Provider value={state.data.present}>
                <AlignmentLinesContext.Provider value={state.alignmentLines}>{children}</AlignmentLinesContext.Provider>
              </GraphValueContext.Provider>
            </ViewportContext.Provider>
          </GraphStateContext.Provider>
        </ConnectingState>
      </GraphControllerContext.Provider>
    </GraphConfigContext.Provider>
  );
}
