import * as React from "react";
import { ConnectingState } from "../../ConnectingState";
import { GraphConfigContext, IDispatch, ViewportContext } from "../../contexts";
import { AlignmentLinesContext } from "../../contexts/AlignmentLinesContext";
import { GraphControllerContext } from "../../contexts/GraphControllerContext";
import {
  GraphStateContext,
  GraphValueContext,
  IGraphStateContext,
} from "../../contexts/GraphStateContext";
import type { GraphController } from "../../controllers/GraphController";
import type { GraphConfig } from "../../models/config/GraphConfig";
import type { GraphModel } from "../../models/GraphModel";
import type { IGraphState } from "../../models/state";

export interface IGraphStateStoreProps<Action = never> {
  state: IGraphState;
  dispatch: IDispatch<Action>;
  graphController: GraphController;
}

export function GraphStateStore<Action = never>(
  props: React.PropsWithChildren<IGraphStateStoreProps<Action>>
): React.ReactElement {
  const { graphController, state, dispatch, children } = props;
  const contextValue = React.useMemo<IGraphStateContext<Action>>(
    () => ({
      state: state,
      dispatch,
    }),
    [state, dispatch]
  );

  const data = state.data.present as GraphModel;

  return (
    <GraphConfigContext.Provider
      value={state.settings.graphConfig as GraphConfig}
    >
      <GraphControllerContext.Provider value={graphController}>
        <ConnectingState data={data} connectState={state.connectState}>
          <GraphStateContext.Provider
            value={contextValue as IGraphStateContext}
          >
            <ViewportContext.Provider value={state.viewport}>
              <GraphValueContext.Provider value={data}>
                <AlignmentLinesContext.Provider value={state.alignmentLines}>
                  {children}
                </AlignmentLinesContext.Provider>
              </GraphValueContext.Provider>
            </ViewportContext.Provider>
          </GraphStateContext.Provider>
        </ConnectingState>
      </GraphControllerContext.Provider>
    </GraphConfigContext.Provider>
  );
}
