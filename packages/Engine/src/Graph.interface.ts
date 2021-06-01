import * as React from "react";
import {
  GraphCanvasEvent,
  GraphContextMenuEvent,
  GraphEdgeEvent,
  GraphMinimapEvent,
  GraphNodeEvent,
  GraphPortEvent,
  GraphScrollBarEvent
} from "./common/GraphEvent.constant";
import { IDummyNode } from "./components/dummyNodes";
import { EdgeModel } from "./models/EdgeModel";
import { GraphModel } from "./models/GraphModel";
import { NodeModel } from "./models/NodeModel";
import { IContainerRect } from "./models/viewport";
import { IPoint, IZoomFixPublicOption, ZoomDirection } from "./utils";

export interface ICanvasNode<T = unknown, P = unknown> {
  readonly shape?: string;
  readonly x: number;
  readonly y: number;
  readonly name?: string;
  readonly id: string;
  readonly state?: GraphNodeState;
  readonly height?: number;
  readonly width?: number;
  readonly automationId?: string;
  readonly isInSearchResults?: boolean;
  readonly isCurrentSearchResult?: boolean;
  readonly ports?: ReadonlyArray<ICanvasPort<P>>;
  readonly ariaLabel?: string;
  readonly data?: Readonly<T>;
}

export interface ICanvasGroup {
  id: string;
  name: string;
  nodeIds: string[];
  padding?: IGap;
  fill?: string;
  stroke?: string;
  shape?: string;
}

export const SELECTED = 0b0001;

// prettier-ignore
export enum GraphEdgeState {
  default = 0b00000000,
  selected = SELECTED,
  activated = 0b00000010,
  connectedToSelected = 0b00000100,
  unconnectedToSelected = 0b00001000,
  editing = 0b00010000
}

export enum CanvasMouseMode {
  pan = "pan",
  select = "select"
}

export interface ICanvasEdge<T = unknown> {
  readonly shape?: string;
  /**
   * source node id
   */
  readonly source: string;
  /**
   * target node id
   */
  readonly target: string;
  readonly sourcePortId: string;
  readonly targetPortId: string;
  readonly id: string;
  readonly state?: GraphEdgeState;
  readonly data?: Readonly<T>;
  readonly automationId?: string;
}

export interface ICanvasPort<T = unknown> {
  readonly id: string;
  readonly name: string;
  readonly shape?: string;
  /**
   * relative position to node
   */
  readonly position: readonly [number, number];
  readonly state?: GraphPortState;
  readonly isInputDisabled?: boolean;
  readonly isOutputDisabled?: boolean;
  readonly ariaLabel?: string;
  readonly data?: Readonly<T>;
  readonly automationId?: string;
}

export type ICanvasPortInit<T = unknown> = Omit<ICanvasPort<T>, "position"> & Partial<Pick<ICanvasPort<T>, "position">>;

// prettier-ignore
export enum GraphNodeState {
  default = 0b00000000,
  selected = SELECTED,
  activated = 0b00000010,
  editing = 0b00000100,
  connectedToSelected = 0b00001000,
  unconnectedToSelected = 0b00010000,
}

export enum GraphNodeStateConst {
  default = "default",
  selected = "selected",
  activated = "activated",
  editing = "editing",
  connectedToSelected = "connectedToSelected",
  unconnectedToSelected = "unconnectedToSelected"
}

// prettier-ignore
export enum GraphPortState {
  default = 0b0000,
  selected = SELECTED,
  activated = 0b0010,
  connecting = 0b0100,
  connectingAsTarget = 0b1000
}

export interface ICanvasData<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  readonly nodes: ReadonlyArray<ICanvasNode<NodeData, PortData>>;
  readonly edges: ReadonlyArray<ICanvasEdge<EdgeData>>;
  readonly groups?: ICanvasGroup[];
}

export interface IGap {
  readonly top?: number;
  readonly bottom?: number;
  readonly left?: number;
  readonly right?: number;
}

interface IEventBase<E = Event | React.SyntheticEvent> {
  rawEvent: E;
}

export interface ICanvasCommonEvent extends IEventBase {
  type: Exclude<
    GraphCanvasEvent,
    | GraphCanvasEvent.ViewportResize
    | GraphCanvasEvent.Navigate
    | GraphCanvasEvent.VirtualizationRecalculated
    | GraphCanvasEvent.Zoom
    | GraphCanvasEvent.Drag
    | GraphCanvasEvent.MouseWheelScroll
    | GraphCanvasEvent.Pinch
    | GraphCanvasEvent.SelectStart
    | GraphCanvasEvent.SelectMove
    | GraphCanvasEvent.UpdateNodeSelectionBySelectBox
    | GraphCanvasEvent.Copy
    | GraphCanvasEvent.Paste
    | GraphCanvasEvent.Undo
    | GraphCanvasEvent.Redo
    | GraphCanvasEvent.Delete
    | GraphCanvasEvent.KeyDown
    | GraphCanvasEvent.KeyUp
    | GraphCanvasEvent.DraggingNodeFromItemPanel
    | GraphCanvasEvent.DraggingNodeFromItemPanelEnd
    | GraphCanvasEvent.ScrollIntoView
    | GraphCanvasEvent.ResetUndoStack
    | GraphCanvasEvent.ResetViewport
    | GraphCanvasEvent.ZoomTo
    | GraphCanvasEvent.ZoomToFit
    | GraphCanvasEvent.SetData
    | GraphCanvasEvent.UpdateData
    | GraphCanvasEvent.Pan
  >;
}

export interface ICanvasViewportResizeEvent {
  type: GraphCanvasEvent.ViewportResize;
  viewportRect: IContainerRect | undefined;
  visibleRect: IContainerRect | undefined;
}

export interface ICanvasVirtualizationEvent {
  type: GraphCanvasEvent.VirtualizationRecalculated;
  performanceStartTime: number;
  renderedNodesCountBeforeRerender: number;
  renderedEdgesCountBeforeRerender: number;
}

export interface ICanvasNavigateEvent<NodeData = unknown, PortData = unknown> extends IEventBase<React.KeyboardEvent> {
  type: GraphCanvasEvent.Navigate;
  node?: NodeModel<NodeData, PortData>;
  port?: ICanvasPort<PortData>;
}

export interface ICanvasZoomEvent extends IEventBase {
  type: GraphCanvasEvent.Zoom;
  scale: number;
  /**
   * graph client point
   */
  anchor?: IPoint;
  direction?: ZoomDirection;
}

export interface ICanvasPanEvent extends IEventBase {
  type: GraphCanvasEvent.Drag | GraphCanvasEvent.MouseWheelScroll | GraphCanvasEvent.Pan;
  dx: number;
  dy: number;
  limitBoundary: boolean;
  groupPadding?: IGap;
}

export interface ICanvasPinchEvent extends IEventBase {
  type: GraphCanvasEvent.Pinch;
  dx: number;
  dy: number;
  scale: number;
  anchor: IPoint;
}

export interface ICanvasSelectStartEvent extends IEventBase<MouseEvent> {
  type: GraphCanvasEvent.SelectStart;
}

export interface ICanvasSelectMoveEvent extends IEventBase<MouseEvent> {
  type: GraphCanvasEvent.SelectMove;
  dx: number;
  dy: number;
}

export interface ICanvasUpdateNodeSelectionBySelectBoxEvent {
  type: GraphCanvasEvent.UpdateNodeSelectionBySelectBox;
}

export interface ICanvasSimpleEvent {
  type:
    | GraphCanvasEvent.UpdateNodeSelectionBySelectBox
    | GraphCanvasEvent.Copy
    | GraphCanvasEvent.Undo
    | GraphCanvasEvent.Redo
    | GraphCanvasEvent.Delete
    | GraphCanvasEvent.ResetSelection
    | GraphCanvasEvent.ResetUndoStack;
}

export interface ICanvasPasteEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  type: GraphCanvasEvent.Paste;
  data: ICanvasData<NodeData, EdgeData, PortData>;
  position?: IPoint;
}

export interface ICanvasKeyboardEvent extends IEventBase<React.KeyboardEvent> {
  type: GraphCanvasEvent.KeyDown | GraphCanvasEvent.KeyUp;
}

export interface ICanvasAddNodeEvent {
  type: GraphCanvasEvent.DraggingNodeFromItemPanel;
  node: IDummyNode;
}

export interface ICanvasAddEndNodeEvent {
  type: GraphCanvasEvent.DraggingNodeFromItemPanelEnd;
  node: ICanvasNode | null;
}

export interface IScrollIntoViewEvent extends IPoint {
  type: GraphCanvasEvent.ScrollIntoView;
}

export interface ICanvasResetViewportEvent {
  type: GraphCanvasEvent.ResetViewport;
  ensureNodeVisible: boolean;
}

export interface ICanvasZoomToEvent {
  type: GraphCanvasEvent.ZoomTo;
  scale: number;
  anchor?: IPoint;
  direction?: ZoomDirection;
}

export interface ICanvasZoomToFitEvent extends Omit<IZoomFixPublicOption, "rect"> {
  type: GraphCanvasEvent.ZoomToFit;
}

export interface ICanvasSetDataEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  type: GraphCanvasEvent.SetData;
  data: GraphModel<NodeData, EdgeData, PortData>;
}

export interface ICanvasUpdateDataEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  type: GraphCanvasEvent.UpdateData;
  shouldRecord: boolean;
  updater(prevData: GraphModel<NodeData, EdgeData, PortData>): GraphModel<NodeData, EdgeData, PortData>;
}

export interface ICanvasScrollToEvent extends IPoint {
  type: GraphCanvasEvent.ScrollTo;
}

export type ICanvasEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown> =
  | ICanvasCommonEvent
  | ICanvasViewportResizeEvent
  | ICanvasNavigateEvent<NodeData, PortData>
  | ICanvasVirtualizationEvent
  | ICanvasZoomEvent
  | ICanvasPanEvent
  | ICanvasPinchEvent
  | ICanvasSelectStartEvent
  | ICanvasSelectMoveEvent
  | ICanvasUpdateNodeSelectionBySelectBoxEvent
  | ICanvasSimpleEvent
  | ICanvasPasteEvent<NodeData, EdgeData, PortData>
  | ICanvasKeyboardEvent
  | ICanvasAddNodeEvent
  | ICanvasAddEndNodeEvent
  | IScrollIntoViewEvent
  | ICanvasResetViewportEvent
  | ICanvasZoomToEvent
  | ICanvasZoomToFitEvent
  | ICanvasSetDataEvent
  | ICanvasUpdateDataEvent
  | ICanvasScrollToEvent;

export interface INodeCommonEvent<NodeData = unknown, PortData = unknown> extends IEventBase {
  type: Exclude<
    GraphNodeEvent,
    | GraphNodeEvent.Resizing
    | GraphNodeEvent.DragStart
    | GraphNodeEvent.Drag
    | GraphNodeEvent.DragEnd
    | GraphNodeEvent.Click
    | GraphNodeEvent.SelectAll
    | GraphNodeEvent.Centralize
    | GraphNodeEvent.Locate
    | GraphNodeEvent.Add
    | GraphNodeEvent.ContextMenu
  >;
  node: NodeModel<NodeData, PortData>;
}

export interface INodeResizeEvent<NodeData = unknown, PortData = unknown> extends IEventBase {
  type: GraphNodeEvent.Resizing;
  node: NodeModel<NodeData, PortData>;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
}

export interface INodeContextMenuEvent<NodeData = unknown, PortData = unknown> extends IEventBase<React.MouseEvent> {
  type: GraphNodeEvent.ContextMenu;
  node: NodeModel<NodeData, PortData>;
}

export interface INodeClickEvent<NodeData = unknown, PortData = unknown> extends IEventBase<MouseEvent> {
  type: GraphNodeEvent.Click;
  node: NodeModel<NodeData, PortData>;
  isMultiSelect: boolean;
}

export interface INodeDragStartEvent<NodeData = unknown, PortData = unknown> extends IEventBase {
  type: GraphNodeEvent.DragStart;
  node: NodeModel<NodeData, PortData>;
  isMultiSelect: boolean;
}

export interface INodeDragEvent<NodeData = unknown, PortData = unknown> extends IEventBase {
  type: GraphNodeEvent.Drag;
  node: NodeModel<NodeData, PortData>;
  dx: number;
  dy: number;
  isVisible: boolean;
  isAutoAlignEnable: boolean;
  autoAlignThreshold: number;
}

export interface INodeDragEndEvent<NodeData = unknown, PortData = unknown> extends IEventBase {
  type: GraphNodeEvent.DragEnd;
  node: NodeModel<NodeData, PortData>;
  isDragCanceled: boolean;
}

export interface INodeSimpleEvent {
  type: GraphNodeEvent.SelectAll;
}

export interface INodeCentralizeEvent<NodeData = unknown, PortData = unknown> {
  type: GraphNodeEvent.Centralize;
  nodes: string[];
}

export interface INodeLocateEvent<NodeData = unknown, PortData = unknown> {
  type: GraphNodeEvent.Locate;
  nodes: string[];
  position: IPoint;
}

export interface INodeAddEvent<NodeData = unknown, PortData = unknown> {
  type: GraphNodeEvent.Add;
  node: ICanvasNode<NodeData, PortData>;
}

export type INodeEvent<NodeData = unknown, PortData = unknown> =
  | INodeCommonEvent<NodeData, PortData>
  | INodeResizeEvent<NodeData, PortData>
  | INodeDragStartEvent<NodeData, PortData>
  | INodeDragEvent<NodeData, PortData>
  | INodeDragEndEvent<NodeData, PortData>
  | INodeSimpleEvent
  | INodeCentralizeEvent<NodeData, PortData>
  | INodeLocateEvent<NodeData, PortData>
  | INodeContextMenuEvent<NodeData, PortData>
  | INodeClickEvent<NodeData, PortData>
  | INodeAddEvent<NodeData, PortData>;

export interface IEdgeCommonEvent<T = unknown> extends IEventBase {
  type: Exclude<
    GraphEdgeEvent,
    | GraphEdgeEvent.ConnectStart
    | GraphEdgeEvent.ConnectMove
    | GraphEdgeEvent.ConnectEnd
    | GraphEdgeEvent.ConnectNavigate
    | GraphEdgeEvent.Add
  >;
  edge: EdgeModel<T>;
}

export interface IEdgeConnectStartEvent<T = unknown> extends IEventBase<React.PointerEvent | React.KeyboardEvent> {
  type: GraphEdgeEvent.ConnectStart;
  nodeId: string;
  portId: string;
  /**
   * not exist if started by keyboard
   */
  clientPoint?: IPoint;
}

export interface IEdgeConnectMoveEvent<T = unknown> extends IEventBase<MouseEvent> {
  type: GraphEdgeEvent.ConnectMove;
  clientX: number;
  clientY: number;
}

export interface IEdgeConnectEndEvent<T = unknown> extends IEventBase<MouseEvent | KeyboardEvent | FocusEvent> {
  type: GraphEdgeEvent.ConnectEnd;
  isCancel: boolean;
  defaultEdgeShape: string;
  edgeWillAdd: ((edge: ICanvasEdge, data: GraphModel) => ICanvasEdge) | undefined;
}

export interface IEdgeConnectNavigateEvent<T = unknown> extends IEventBase {
  type: GraphEdgeEvent.ConnectNavigate;
}

export interface IEdgeAddEvent<T = unknown> {
  type: GraphEdgeEvent.Add;
  edge: ICanvasEdge<T>;
}

export type IEdgeEvent<T> =
  | IEdgeCommonEvent<T>
  | IEdgeConnectStartEvent<T>
  | IEdgeConnectMoveEvent<T>
  | IEdgeConnectEndEvent<T>
  | IEdgeConnectNavigateEvent<T>
  | IEdgeAddEvent<T>;

export interface IPortEvent<NodeData = unknown, PortData = unknown> extends IEventBase {
  type: GraphPortEvent;
  node: NodeModel<NodeData, PortData>;
  port: ICanvasPort<PortData>;
}

export interface IScrollBarCommonEvent {
  type: Exclude<GraphScrollBarEvent, GraphScrollBarEvent.Scroll>;
}

export interface IScrollBarScrollEvent extends Omit<ICanvasPanEvent, "type"> {
  type: GraphScrollBarEvent.Scroll;
}

export type IScrollBarEvent = IScrollBarCommonEvent | IScrollBarScrollEvent;

export interface IMinimapCommonEvent extends IEventBase {
  type: Exclude<GraphMinimapEvent, GraphMinimapEvent.Pan>;
}

export interface IMinimapPanEvent extends IEventBase {
  type: GraphMinimapEvent.Pan;
  dx: number;
  dy: number;
}

export type IMinimapEvent = IMinimapCommonEvent | IMinimapPanEvent;

export interface IContextMenuOpenEvent {
  type: GraphContextMenuEvent.Open;
  /**
   * screen client x
   */
  x: number;
  /**
   * screen client y
   */
  y: number;
}

export interface IContextMenuCloseEvent {
  type: GraphContextMenuEvent.Close;
}

export type IContextMenuEvent = IContextMenuOpenEvent | IContextMenuCloseEvent;

export type IEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown> =
  | ICanvasEvent<NodeData, EdgeData, PortData>
  | INodeEvent<NodeData, PortData>
  | IEdgeEvent<EdgeData>
  | IPortEvent<NodeData, PortData>
  | IScrollBarEvent
  | IMinimapEvent
  | IContextMenuEvent;
