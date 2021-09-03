import * as React from "react";
import { NODE_MAX_VISIBLE_LENGTH, NODE_MIN_VISIBLE_LENGTH } from "../common/constants";
import { emptyDummyNodes } from "../components/dummyNodes";
import { emptySelectBoxPosition } from "../components/Graph/SelectBox";
import { defaultFeatures } from "../Features";
import { GraphConfigBuilder } from "../models/config/GraphConfigBuilder";
import type { IEvent } from "../models/event";
import type { IGap, IRectSize, ITransformMatrix, IViewport } from "../models/geometry";
import { GraphModel } from "../models/GraphModel";
import { GraphBehavior, IGraphSettings, IGraphState } from "../models/state";
import { Debug } from "../utils/debug";
import { resetUndoStack } from "../utils/history";

export const EMPTY_TRANSFORM_MATRIX: ITransformMatrix = [1, 0, 0, 1, 0, 0];

export const EMPTY_VIEW_PORT: IViewport = {
  rect: undefined,
  transformMatrix: EMPTY_TRANSFORM_MATRIX
};

export const EMPTY_GAP: IGap = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

export const DEFAULT_NODE_MIN_VISIBLE_SIZE: IRectSize = {
  width: NODE_MIN_VISIBLE_LENGTH,
  height: NODE_MIN_VISIBLE_LENGTH
};

export const DEFAULT_NODE_MAX_VISIBLE_SIZE: IRectSize = {
  width: NODE_MAX_VISIBLE_LENGTH,
  height: NODE_MAX_VISIBLE_LENGTH
};

export const DEFAULT_GRAPH_SETTINGS: IGraphSettings = {
  features: defaultFeatures,
  graphConfig: GraphConfigBuilder.default().build(),
  canvasBoundaryPadding: EMPTY_GAP,
  nodeMinVisibleSize: DEFAULT_NODE_MIN_VISIBLE_SIZE,
  nodeMaxVisibleSize: DEFAULT_NODE_MAX_VISIBLE_SIZE
};

export const EMPTY_GRAPH_STATE: IGraphState = {
  settings: DEFAULT_GRAPH_SETTINGS,
  behavior: GraphBehavior.default,
  data: resetUndoStack(GraphModel.empty()),
  viewport: {
    transformMatrix: [1, 0, 0, 1, 0, 0],
    rect: undefined
  },
  dummyNodes: emptyDummyNodes(),
  alignmentLines: [],
  activeKeys: new Set<string>(),
  selectBoxPosition: emptySelectBoxPosition(),
  connectState: undefined
};

/**
 *
 */
function warnGraphStateContext(): void {
  Debug.warn("Missing GraphStateContext, GraphStateContext must be used as child of GraphStateStore");
}

export const defaultGraphStateContext: IGraphStateContext = {
  get state(): IGraphState {
    warnGraphStateContext();
    return EMPTY_GRAPH_STATE;
  },
  dispatch: () => {
    warnGraphStateContext();
  }
};

export type TDataComposer<NodeData = unknown, EdgeData = unknown, PortData = unknown> = (
  prev: GraphModel<NodeData, EdgeData, PortData>,
  prevState: IGraphState<NodeData, EdgeData, PortData>
) => GraphModel<NodeData, EdgeData, PortData>;

export const EMPTY_CONNECT_STATE = {
  sourceNode: undefined,
  sourcePort: undefined,
  targetNode: undefined,
  targetPort: undefined,
  movingPoint: {
    x: 0,
    y: 0
  }
};

export type IGraphAction<NodeData = unknown, EdgeData = unknown, PortData = unknown> = IEvent<
  NodeData,
  EdgeData,
  PortData
>;

export type IDispatchCallback<NodeData = unknown, EdgeData = unknown, PortData = unknown> = (
  state: IGraphState<NodeData, EdgeData, PortData>,
  prevState: IGraphState<NodeData, EdgeData, PortData>
) => void;

export type IDispatch<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never> = (
  action: IEvent<NodeData, EdgeData, PortData> | Action,
  callback?: IDispatchCallback<NodeData, EdgeData, PortData>
) => void;

export interface IGraphStateContext<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never> {
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
      console.warn("Default graph data value is being used. Please check if you forget rendering Graph component");

      return target[prop];
    }
  })
);

export const GraphStateContext = React.createContext<IGraphStateContext>(defaultGraphStateContext);

export type IGraphReactReducer<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown,
  Action = never
> = React.Reducer<IGraphState<NodeData, EdgeData, PortData>, IEvent<NodeData, EdgeData, PortData> | Action>;

export type IGraphReducer<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never> = (
  next: IGraphReactReducer<NodeData, EdgeData, PortData, Action>
) => IGraphReactReducer<NodeData, EdgeData, PortData, Action>;

export const setData = <NodeData = unknown, EdgeData = unknown, PortData = unknown>(
  state: IGraphState<NodeData, EdgeData, PortData>,
  data: GraphModel<NodeData, EdgeData, PortData>
): IGraphState<NodeData, EdgeData, PortData> => ({
  ...state,
  data: {
    ...state.data,
    present: data
  }
});

export const updateData = <NodeData = unknown, EdgeData = unknown, PortData = unknown>(
  state: IGraphState<NodeData, EdgeData, PortData>,
  f: (data: GraphModel<NodeData, EdgeData, PortData>) => GraphModel<NodeData, EdgeData, PortData>
): IGraphState<NodeData, EdgeData, PortData> => ({
  ...state,
  data: {
    ...state.data,
    present: f(state.data.present)
  }
});
