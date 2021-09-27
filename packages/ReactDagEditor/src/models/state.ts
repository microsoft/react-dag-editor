import { emptyDummyNodes } from "../components/dummyNodes";
import { emptySelectBoxPosition, ISelectBoxPosition } from "../components/Graph/SelectBox";
import type { ILine } from "../components/Line";
import { DEFAULT_GRAPH_SETTINGS, EMPTY_TRANSFORM_MATRIX } from "../contexts";
import type { GraphFeatures } from "../Features";
import { IHistory, IZoomCommonParams, resetUndoStack } from "../utils";
import type { IGraphConfig } from "./config/types";
import type { IDummyNodes } from "./dummy-node";
import type { IGap, IPoint, ITransformMatrix, IViewport } from "./geometry";
import { GraphModel } from "./GraphModel";

export enum CanvasMouseMode {
  pan = "pan",
  select = "select",
}

export enum GraphBehavior {
  default = "default",
  dragging = "dragging",
  panning = "panning",
  multiSelect = "multiSelect",
  connecting = "connecting",
  addingNode = "addingNode",
}

export interface IGraphDataState<NodeData = unknown, EdgeData = unknown, PortData = unknown>
  extends IHistory<GraphModel<NodeData, EdgeData, PortData>> {}

export interface IConnectingState {
  sourceNode: string;
  sourcePort: string;
  targetNode: string | undefined;
  targetPort: string | undefined;
  movingPoint: IPoint | undefined;
}

export interface IGraphSettings<NodeData = unknown, EdgeData = unknown, PortData = unknown> extends IZoomCommonParams {
  canvasBoundaryPadding: IGap;
  graphConfig: IGraphConfig<NodeData, EdgeData, PortData>;
  features: ReadonlySet<GraphFeatures>;
}

export interface IGraphState<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  settings: IGraphSettings<NodeData, EdgeData, PortData>;
  data: IGraphDataState<NodeData, EdgeData, PortData>;
  viewport: IViewport;
  behavior: GraphBehavior;
  dummyNodes: IDummyNodes;
  alignmentLines: ILine[];
  activeKeys: Set<string>;
  contextMenuPosition?: IPoint;
  selectBoxPosition: ISelectBoxPosition;
  connectState: IConnectingState | undefined;
}

export interface IGraphReducerInitializerParams<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  data?: GraphModel<NodeData, EdgeData, PortData>;
  transformMatrix?: ITransformMatrix;
  settings?: Partial<IGraphSettings<NodeData, EdgeData, PortData>>;
}

export function createGraphState<NodeData = unknown, EdgeData = unknown, PortData = unknown>(
  params: IGraphReducerInitializerParams<NodeData, EdgeData, PortData>
): IGraphState<NodeData, EdgeData, PortData> {
  const { data, transformMatrix, settings } = params;
  return {
    settings: {
      ...(DEFAULT_GRAPH_SETTINGS as IGraphSettings<NodeData, EdgeData, PortData>),
      ...settings,
    },
    data: resetUndoStack(data ?? GraphModel.empty()),
    viewport: {
      rect: undefined,
      transformMatrix: transformMatrix ?? EMPTY_TRANSFORM_MATRIX,
    },
    behavior: GraphBehavior.default,
    dummyNodes: emptyDummyNodes(),
    alignmentLines: [],
    activeKeys: new Set<string>(),
    selectBoxPosition: emptySelectBoxPosition(),
    connectState: undefined,
  };
}
