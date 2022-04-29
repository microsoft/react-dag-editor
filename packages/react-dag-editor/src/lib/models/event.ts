import * as React from "react";
import type { IZoomFixPublicParams } from "../utils";
import type { ICanvasData } from "./canvas";
import type { IDummyNode } from "./dummy-node";
import type { ICanvasEdge } from "./edge";
import type { EdgeModel } from "./EdgeModel";
import type { IContainerRect, IPoint, Direction } from "./geometry";
import type { GraphModel } from "./GraphModel";
import type { ICanvasNode } from "./node";
import type { NodeModel } from "./NodeModel";
import type { PortModel } from "./PortModel";
import type { IGraphSettings } from "./state";

interface IEventBase<E = Event | React.SyntheticEvent> {
  rawEvent: E;
}

export enum GraphNodeEvent {
  Click = "[Node]Click",
  DoubleClick = "[Node]DoubleClick",
  MouseDown = "[Node]MouseDown",
  MouseUp = "[Node]MouseUp",
  MouseEnter = "[Node]MouseEnter",
  MouseLeave = "[Node]MouseLeave",
  MouseOver = "[Node]MouseOver",
  MouseOut = "[Node]MouseOut",
  MouseMove = "[Node]MouseMove",
  ContextMenu = "[Node]ContextMenu",
  Drag = "[Node]Drag",
  DragStart = "[Node]DragStart",
  DragEnd = "[Node]DragEnd",
  PointerDown = "[Node]PointerDown",
  PointerEnter = "[Node]PointerEnter",
  PointerMove = "[Node]PointerMove",
  PointerLeave = "[Node]PointerLeave",
  PointerUp = "[Node]PointerUp",
  Resizing = "[Node]Resizing",
  ResizingStart = "[Node]ResizingStart",
  ResizingEnd = "[Node]ResizingEnd",
  KeyDown = "[Node]KeyDown",
  Select = "[Node]Select",
  SelectAll = "[Node]SelectAll",
  Centralize = "[Node]Centralize",
  Locate = "[Node]Locate",
  Add = "[Node]Add",
}

export enum GraphEdgeEvent {
  Click = "[Edge]Click",
  DoubleClick = "[Edge]DoubleClick",
  MouseEnter = "[Edge]MouseEnter",
  MouseLeave = "[Edge]MouseLeave",
  MouseOver = "[Edge]MouseOver",
  MouseOut = "[Edge]MouseOut",
  MouseMove = "[Edge]MouseMove",
  MouseDown = "[Edge]MouseDown",
  MouseUp = "[Edge]MouseUp",
  ContextMenu = "[Edge]ContextMenu",
  ConnectStart = "[Edge]ConnectStart",
  ConnectMove = "[Edge]ConnectMove",
  ConnectEnd = "[Edge]ConnectEnd",
  ConnectNavigate = "[Edge]ConnectNavigate",
  Add = "[Edge]Add",
}

export enum GraphPortEvent {
  Click = "[Port]Click",
  DoubleClick = "[Port]DoubleClick",
  MouseDown = "[Port]MouseDown",
  PointerDown = "[Port]PointerDown",
  PointerUp = "[Port]PointerUp",
  PointerEnter = "[Port]PointerEnter",
  PointerLeave = "[Port]PointerLeave",
  MouseUp = "[Port]MouseUp",
  MouseEnter = "[Port]MouseEnter",
  MouseLeave = "[Port]MouseLeave",
  MouseOver = "[Port]MouseOver",
  MouseOut = "[Port]MouseOut",
  MouseMove = "[Port]MouseMove",
  ContextMenu = "[Port]ContextMenu",
  KeyDown = "[Port]KeyDown",
  Focus = "[Port]Focus",
  Blur = "[Port]Blur",
}

export enum GraphCanvasEvent {
  Click = "[Canvas]Click",
  DoubleClick = "[Canvas]DoubleClick",
  MouseDown = "[Canvas]MouseDown",
  MouseUp = "[Canvas]MouseUp",
  MouseEnter = "[Canvas]MouseEnter",
  MouseLeave = "[Canvas]MouseLeave",
  MouseOver = "[Canvas]MouseOver",
  MouseOut = "[Canvas]MouseOut",
  MouseMove = "[Canvas]MouseMove",
  ContextMenu = "[Canvas]ContextMenu",
  DragStart = "[Canvas]DragStart",
  Drag = "[Canvas]Drag",
  DragEnd = "[Canvas]DragEnd",
  Pan = "[Canvas]Pan",
  Focus = "[Canvas]Focus",
  Blur = "[Canvas]Blur",
  Zoom = "[Canvas]Zoom",
  Pinch = "[Canvas]Pinch",
  KeyDown = "[Canvas]KeyDown",
  KeyUp = "[Canvas]KeyUp",
  SelectStart = "[Canvas]SelectStart",
  SelectMove = "[Canvas]SelectMove",
  SelectEnd = "[Canvas]SelectEnd",
  UpdateNodeSelectionBySelectBox = "[Canvas]UpdateNodeSelectionBySelectBox",
  MouseWheelScroll = "[Canvas]MouseWheelScroll",
  DraggingNodeFromItemPanel = "[Canvas]DraggingNodeFromItemPanel",
  DraggingNodeFromItemPanelStart = "[Canvas]DraggingNodeFromItemPanelStart",
  DraggingNodeFromItemPanelEnd = "[Canvas]DraggingNodeFromItemPanelEnd",
  ViewportResize = "[Canvas]ViewportResize",
  Navigate = "[Canvas]Navigate",
  VirtualizationRecalculated = "[Canvas]VirtualizationRecalculated",
  ResetSelection = "[Canvas]ResetSelection",
  Copy = "[Canvas]Copy",
  Paste = "[Canvas]Paste",
  Delete = "[Canvas]Delete",
  Undo = "[Canvas]Undo",
  Redo = "[Canvas]Redo",
  ScrollIntoView = "[Canvas]ScrollIntoView",
  ResetUndoStack = "[Canvas]ResetUndoStack",
  ResetViewport = "[Canvas]ResetViewport",
  ZoomTo = "[Canvas]ZoomTo",
  ZoomToFit = "[Canvas]ZoomToFit",
  SetData = "[Canvas]SetData",
  UpdateData = "[Canvas]UpdateData",
  ScrollTo = "[Canvas]ScrollTo",
  UpdateSettings = "[Canvas]UpdateSettings",
}

export enum GraphScrollBarEvent {
  ScrollStart = "[ScrollBar]ScrollStart",
  Scroll = "[ScrollBar]Scroll",
  ScrollEnd = "[ScrollBar]ScrollEnd",
}

export enum GraphMinimapEvent {
  PanStart = "[Minimap]PanStart",
  Pan = "[Minimap]Pan",
  PanEnd = "[Minimap]PanEnd",
  Click = "[Minimap]Click",
}

export enum GraphContextMenuEvent {
  Open = "[ContextMenu]Open",
  Close = "[ContextMenu]Close",
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
    | GraphCanvasEvent.UpdateSettings
  >;
}

export interface ICanvasViewportResizeEvent {
  type: GraphCanvasEvent.ViewportResize;
  viewportRect: IContainerRect | undefined;
}

export interface ICanvasVirtualizationEvent {
  type: GraphCanvasEvent.VirtualizationRecalculated;
  performanceStartTime: number;
  renderedNodes: ReadonlySet<string>;
  renderedEdges: ReadonlySet<string>;
  previousRenderedNodes: ReadonlySet<string>;
  previousRenderedEdges: ReadonlySet<string>;
}

export interface ICanvasNavigateEvent extends IEventBase<React.KeyboardEvent> {
  type: GraphCanvasEvent.Navigate;
  node?: NodeModel;
  port?: PortModel;
}

export interface ICanvasZoomEvent extends Partial<IEventBase> {
  type: GraphCanvasEvent.Zoom;
  scale: number;
  /**
   * graph client point
   */
  anchor?: IPoint;
  direction?: Direction;
}

export interface ICanvasPanEvent extends IEventBase {
  type:
    | GraphCanvasEvent.Drag
    | GraphCanvasEvent.MouseWheelScroll
    | GraphCanvasEvent.Pan;
  dx: number;
  dy: number;
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

export interface ICanvasPasteEvent {
  type: GraphCanvasEvent.Paste;
  data: ICanvasData;
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
  direction?: Direction;
}

export interface ICanvasZoomToFitEvent
  extends Omit<IZoomFixPublicParams, "rect"> {
  type: GraphCanvasEvent.ZoomToFit;
}

export interface ICanvasSetDataEvent {
  type: GraphCanvasEvent.SetData;
  data: GraphModel;
}

export interface ICanvasUpdateDataEvent {
  type: GraphCanvasEvent.UpdateData;
  shouldRecord: boolean;

  updater(prevData: GraphModel): GraphModel;
}

export interface ICanvasScrollToEvent extends IPoint {
  type: GraphCanvasEvent.ScrollTo;
}

export type ICanvasEvent =
  | ICanvasCommonEvent
  | ICanvasViewportResizeEvent
  | ICanvasNavigateEvent
  | ICanvasVirtualizationEvent
  | ICanvasZoomEvent
  | ICanvasPanEvent
  | ICanvasPinchEvent
  | ICanvasSelectStartEvent
  | ICanvasSelectMoveEvent
  | ICanvasUpdateNodeSelectionBySelectBoxEvent
  | ICanvasSimpleEvent
  | ICanvasPasteEvent
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

export interface INodeCommonEvent extends IEventBase {
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
    | GraphNodeEvent.Select
  >;
  node: NodeModel;
}

export interface INodeResizeEvent extends IEventBase {
  type: GraphNodeEvent.Resizing;
  node: NodeModel;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
}

export interface INodeContextMenuEvent extends IEventBase<React.MouseEvent> {
  type: GraphNodeEvent.ContextMenu;
  node: NodeModel;
}

export interface INodeClickEvent
  extends IEventBase<MouseEvent | React.MouseEvent> {
  type: GraphNodeEvent.Click;
  node: NodeModel;
  isMultiSelect: boolean;
}

export interface INodeDragStartEvent extends IEventBase {
  type: GraphNodeEvent.DragStart;
  node: NodeModel;
  isMultiSelect: boolean;
}

export interface INodeDragEvent extends IEventBase {
  type: GraphNodeEvent.Drag;
  node: NodeModel;
  dx: number;
  dy: number;
  isVisible: boolean;
  isAutoAlignEnable: boolean;
  autoAlignThreshold: number;
}

export interface INodeDragEndEvent extends IEventBase {
  type: GraphNodeEvent.DragEnd;
  node: NodeModel;
  isDragCanceled: boolean;
}

export interface INodeSimpleEvent {
  type: GraphNodeEvent.SelectAll;
}

export interface INodeCentralizeEvent {
  type: GraphNodeEvent.Centralize;
  nodes: string[];
}

export interface INodeLocateEvent {
  type: GraphNodeEvent.Locate;
  nodes: string[];
  position: IPoint;
}

export interface INodeAddEvent {
  type: GraphNodeEvent.Add;
  node: ICanvasNode;
}

export interface INodeSelectEvent {
  type: GraphNodeEvent.Select;
  nodes: string[];
}

export type INodeEvent =
  | INodeCommonEvent
  | INodeResizeEvent
  | INodeDragStartEvent
  | INodeDragEvent
  | INodeDragEndEvent
  | INodeSimpleEvent
  | INodeCentralizeEvent
  | INodeLocateEvent
  | INodeContextMenuEvent
  | INodeClickEvent
  | INodeAddEvent
  | INodeSelectEvent;

export interface IEdgeCommonEvent extends IEventBase {
  type: Exclude<
    GraphEdgeEvent,
    | GraphEdgeEvent.ConnectStart
    | GraphEdgeEvent.ConnectMove
    | GraphEdgeEvent.ConnectEnd
    | GraphEdgeEvent.ConnectNavigate
    | GraphEdgeEvent.Add
  >;
  edge: EdgeModel;
}

export interface IEdgeConnectStartEvent
  extends IEventBase<React.PointerEvent | React.KeyboardEvent> {
  type: GraphEdgeEvent.ConnectStart;
  nodeId: string;
  portId: string;
  /**
   * not exist if started by keyboard
   */
  clientPoint?: IPoint;
}

export interface IEdgeConnectMoveEvent extends IEventBase<MouseEvent> {
  type: GraphEdgeEvent.ConnectMove;
  clientX: number;
  clientY: number;
}

export interface IEdgeConnectEndEvent
  extends IEventBase<MouseEvent | KeyboardEvent | FocusEvent> {
  type: GraphEdgeEvent.ConnectEnd;
  isCancel: boolean;
  edgeWillAdd:
    | ((edge: ICanvasEdge, data: GraphModel) => ICanvasEdge)
    | undefined;
}

export interface IEdgeConnectNavigateEvent extends IEventBase {
  type: GraphEdgeEvent.ConnectNavigate;
}

export interface IEdgeAddEvent {
  type: GraphEdgeEvent.Add;
  edge: ICanvasEdge;
}

export type IEdgeEvent =
  | IEdgeCommonEvent
  | IEdgeConnectStartEvent
  | IEdgeConnectMoveEvent
  | IEdgeConnectEndEvent
  | IEdgeConnectNavigateEvent
  | IEdgeAddEvent;

export interface IPortEvent extends IEventBase {
  type: GraphPortEvent;
  node: NodeModel;
  port: PortModel;
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

export interface ICanvasUpdateSettingsEvent extends Partial<IGraphSettings> {
  type: GraphCanvasEvent.UpdateSettings;
}

export type IContextMenuEvent = IContextMenuOpenEvent | IContextMenuCloseEvent;
export type IEvent = (
  | ICanvasEvent
  | INodeEvent
  | IEdgeEvent
  | IPortEvent
  | IScrollBarEvent
  | IMinimapEvent
  | IContextMenuEvent
  | ICanvasUpdateSettingsEvent
) & { intercepted?: boolean };
