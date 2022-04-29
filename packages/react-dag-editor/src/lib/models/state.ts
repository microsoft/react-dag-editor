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

export interface IGraphDataState extends IHistory<GraphModel> {}

export interface IConnectingState {
  sourceNode: string;
  sourcePort: string;
  targetNode: string | undefined;
  targetPort: string | undefined;
  movingPoint: IPoint | undefined;
}

export interface IGraphSettings extends IZoomCommonParams {
  canvasBoundaryPadding: IGap;
  graphConfig: IGraphConfig;
  features: ReadonlySet<GraphFeatures>;
}

export interface IGraphState {
  settings: IGraphSettings;
  data: IGraphDataState;
  viewport: IViewport;
  behavior: GraphBehavior;
  dummyNodes: IDummyNodes;
  alignmentLines: ILine[];
  activeKeys: Set<string>;
  contextMenuPosition?: IPoint;
  selectBoxPosition: ISelectBoxPosition;
  connectState: IConnectingState | undefined;
}

export interface IGraphReducerInitializerParams {
  data?: GraphModel;
  transformMatrix?: ITransformMatrix;
  settings?: Partial<IGraphSettings>;
}
