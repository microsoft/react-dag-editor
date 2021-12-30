import {
  NODE_MAX_VISIBLE_LENGTH,
  NODE_MIN_VISIBLE_LENGTH,
} from "./common/constants";
import { emptySelectBoxPosition } from "./components/Graph/SelectBox";
import { defaultFeatures } from "./Features";
import { GraphConfigBuilder } from "./models/config/GraphConfigBuilder";
import { ContentState } from "./models/ContentState";
import { emptyDummyNodes } from "./models/dummy-node";
import type {
  IGap,
  IRectSize,
  ITransformMatrix,
  IViewport,
} from "./models/geometry";
import {
  GraphBehavior,
  IGraphReducerInitializerParams,
  IGraphSettings,
  IGraphState,
} from "./models/state";
import { resetUndoStack } from "./utils";

export const EMPTY_TRANSFORM_MATRIX: ITransformMatrix = [1, 0, 0, 1, 0, 0];

export const EMPTY_VIEW_PORT: IViewport = {
  rect: undefined,
  transformMatrix: EMPTY_TRANSFORM_MATRIX,
};

export const EMPTY_GAP: IGap = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const DEFAULT_NODE_MIN_VISIBLE_SIZE: IRectSize = {
  width: NODE_MIN_VISIBLE_LENGTH,
  height: NODE_MIN_VISIBLE_LENGTH,
};

export const DEFAULT_NODE_MAX_VISIBLE_SIZE: IRectSize = {
  width: NODE_MAX_VISIBLE_LENGTH,
  height: NODE_MAX_VISIBLE_LENGTH,
};

export const DEFAULT_GRAPH_SETTINGS: IGraphSettings = {
  features: defaultFeatures,
  graphConfig: GraphConfigBuilder.default().build(),
  canvasBoundaryPadding: EMPTY_GAP,
  nodeMinVisibleSize: DEFAULT_NODE_MIN_VISIBLE_SIZE,
  nodeMaxVisibleSize: DEFAULT_NODE_MAX_VISIBLE_SIZE,
};

export const EMPTY_GRAPH_STATE: IGraphState = createGraphState({});

export function createGraphState(
  params: IGraphReducerInitializerParams
): IGraphState {
  const { data, transformMatrix, settings } = params;
  return {
    settings: {
      ...DEFAULT_GRAPH_SETTINGS,
      ...settings,
    },
    data: resetUndoStack(data ?? ContentState.empty()),
    viewport: {
      rect: undefined,
      transformMatrix: transformMatrix ?? EMPTY_TRANSFORM_MATRIX,
    },
    behavior: GraphBehavior.Default,
    dummyNodes: emptyDummyNodes(),
    alignmentLines: [],
    activeKeys: new Set<string>(),
    selectBoxPosition: emptySelectBoxPosition(),
    connectState: undefined,
  };
}
