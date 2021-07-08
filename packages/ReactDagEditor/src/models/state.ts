import { ISelectBoxPosition } from "../components/Graph/SelectBox";
import { ILine } from "../components/Line";
import { IGraphConfig } from "../contexts";
import { GraphFeatures } from "../Features";
import { IHistory } from "../utils";
import { IDummyNodes } from "./dummy-node";
import { IPoint, IViewport } from "./geometry";
import { GraphModel } from "./GraphModel";

export enum CanvasMouseMode {
  pan = "pan",
  select = "select"
}

export enum GraphBehavior {
  default = "default",
  dragging = "dragging",
  panning = "panning",
  multiSelect = "multiSelect",
  connecting = "connecting",
  addingNode = "addingNode"
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

export interface IGraphSettings<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  graphConfig: IGraphConfig<NodeData, EdgeData, PortData>;
  features: ReadonlySet<GraphFeatures>;
}

export interface IGraphState<NodeData = unknown, EdgeData = unknown, PortData = unknown>
  extends IGraphSettings<NodeData, EdgeData, PortData> {
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
