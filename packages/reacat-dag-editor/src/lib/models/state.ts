import { ISelectBoxPosition } from "../components/Graph/SelectBox";
import type { ILine } from "../components/Line";
import type { GraphFeatures } from "../Features";
import type { IHistory, IZoomCommonParams } from "../utils";
import type { IGraphConfig } from "./config/types";
import { IDummyNodes } from "./dummy-node";
import type { IGap, IPoint, ITransformMatrix, IViewport } from "./geometry";
import { GraphModel } from "./GraphModel";

export enum CanvasMouseMode {
  Pan = "Pan",
  Select = "Select",
}

export enum GraphBehavior {
  Default = "default",
  Dragging = "dragging",
  Panning = "panning",
  MultiSelect = "multiSelect",
  Connecting = "connecting",
  AddingNode = "addingNode",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGraphDataState<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> extends IHistory<GraphModel<NodeData, EdgeData, PortData>> {}

export interface IConnectingState {
  sourceNode: string;
  sourcePort: string;
  targetNode: string | undefined;
  targetPort: string | undefined;
  movingPoint: IPoint | undefined;
}

export interface IGraphSettings<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> extends IZoomCommonParams {
  canvasBoundaryPadding: IGap;
  graphConfig: IGraphConfig<NodeData, EdgeData, PortData>;
  features: ReadonlySet<GraphFeatures>;
}

export interface IGraphState<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
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

export interface IGraphReducerInitializerParams<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  data?: GraphModel<NodeData, EdgeData, PortData>;
  transformMatrix?: ITransformMatrix;
  settings?: Partial<IGraphSettings<NodeData, EdgeData, PortData>>;
}
