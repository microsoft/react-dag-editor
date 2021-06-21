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
  SelectAll = "[Node]SelectAll",
  Centralize = "[Node]Centralize",
  Locate = "[Node]Locate",
  Add = "[Node]Add"
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
  Add = "[Edge]Add"
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
  Blur = "[Port]Blur"
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
  ViewPortResize = "[Canvas]ViewPortResize",
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
  ResetViewPort = "[Canvas]ResetViewPort",
  ZoomTo = "[Canvas]ZoomTo",
  ZoomToFit = "[Canvas]ZoomToFit",
  SetData = "[Canvas]SetData",
  UpdateData = "[Canvas]UpdateData",
  ScrollTo = "[Canvas]ScrollTo"
}

export enum GraphScrollBarEvent {
  ScrollStart = "[ScrollBar]ScrollStart",
  Scroll = "[ScrollBar]Scroll",
  ScrollEnd = "[ScrollBar]ScrollEnd",
  /**
   * @deprecated
   */
  ScrollLeft = "[ScrollBar]ScrollToLeft",
  /**
   * @deprecated
   */
  ScrollRight = "[ScrollBar]ScrollToRight",
  /**
   * @deprecated
   */
  ScrollTop = "[ScrollBar]ScrollToTop",
  /**
   * @deprecated
   */
  ScrollBottom = "[ScrollBar]ScrollToBottom"
}

export enum GraphMinimapEvent {
  PanStart = "[Minimap]PanStart",
  Pan = "[Minimap]Pan",
  PanEnd = "[Minimap]PanEnd",
  Click = "[Minimap]Click"
}

export enum GraphContextMenuEvent {
  Open = "[ContextMenu]Open",
  Close = "[ContextMenu]Close"
}
