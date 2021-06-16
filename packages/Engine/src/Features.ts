export enum GraphFeatures {
  nodeDraggable = "nodeDraggable",
  nodeResizable = "nodeResizable",
  clickNodeToSelect = "clickNodeToSelect",
  panCanvas = "panCanvas",
  multipleSelect = "multipleSelect",
  lassoSelect = "lassoSelect",
  delete = "delete",
  addNewNodes = "addNewNodes",
  addNewEdges = "addNewEdges",
  addNewPorts = "addNewPorts",
  sidePanel = "sidePanel",
  autoFit = "autoFit",
  canvasHorizontalScrollable = "canvasHorizontalScrollable",
  canvasVerticalScrollable = "canvasVerticalScrollable",
  nodeHoverView = "nodeHoverView",
  portHoverView = "portHoverView",
  addEdgesByKeyboard = "addEdgesByKeyboard",
  a11yFeatures = "a11yFeatures",
  editNode = "editNode",
  autoAlign = "autoAlign",
  undoStack = "undoStack",
  ctrlKeyZoom = "ctrlKeyZoom",
  limitBoundary = "limitBoundary",
  editEdge = "editEdge"
}

export const allFeatures = new Set([
  GraphFeatures.nodeDraggable,
  GraphFeatures.nodeResizable,
  GraphFeatures.clickNodeToSelect,
  GraphFeatures.panCanvas,
  GraphFeatures.multipleSelect,
  GraphFeatures.lassoSelect,
  GraphFeatures.delete,
  GraphFeatures.addNewNodes,
  GraphFeatures.addNewEdges,
  GraphFeatures.addNewPorts,
  GraphFeatures.sidePanel,
  GraphFeatures.canvasHorizontalScrollable,
  GraphFeatures.canvasVerticalScrollable,
  GraphFeatures.nodeHoverView,
  GraphFeatures.portHoverView,
  GraphFeatures.addEdgesByKeyboard,
  GraphFeatures.a11yFeatures,
  GraphFeatures.autoFit,
  GraphFeatures.editNode,
  GraphFeatures.autoAlign,
  GraphFeatures.undoStack,
  GraphFeatures.ctrlKeyZoom,
  GraphFeatures.limitBoundary,
  GraphFeatures.editEdge
]);

export const defaultFeatures = new Set([
  GraphFeatures.nodeDraggable,
  GraphFeatures.nodeResizable,
  GraphFeatures.clickNodeToSelect,
  GraphFeatures.panCanvas,
  GraphFeatures.multipleSelect,
  GraphFeatures.delete,
  GraphFeatures.addNewNodes,
  GraphFeatures.addNewEdges,
  GraphFeatures.addNewPorts,
  GraphFeatures.sidePanel,
  GraphFeatures.canvasHorizontalScrollable,
  GraphFeatures.canvasVerticalScrollable,
  GraphFeatures.nodeHoverView,
  GraphFeatures.portHoverView,
  GraphFeatures.addEdgesByKeyboard,
  GraphFeatures.a11yFeatures,
  GraphFeatures.editNode,
  GraphFeatures.autoAlign,
  GraphFeatures.undoStack,
  GraphFeatures.ctrlKeyZoom,
  GraphFeatures.limitBoundary
]);

export const dataReadonlyMode = new Set([
  GraphFeatures.nodeDraggable,
  GraphFeatures.nodeResizable,
  GraphFeatures.clickNodeToSelect,
  GraphFeatures.panCanvas,
  GraphFeatures.multipleSelect,
  GraphFeatures.sidePanel,
  GraphFeatures.canvasHorizontalScrollable,
  GraphFeatures.canvasVerticalScrollable,
  GraphFeatures.nodeHoverView,
  GraphFeatures.portHoverView,
  GraphFeatures.a11yFeatures,
  GraphFeatures.ctrlKeyZoom,
  GraphFeatures.limitBoundary
]);

export const GanttChartFeatures = new Set([
  GraphFeatures.clickNodeToSelect,
  GraphFeatures.sidePanel,
  GraphFeatures.canvasHorizontalScrollable,
  GraphFeatures.canvasVerticalScrollable,
  GraphFeatures.nodeHoverView,
  GraphFeatures.portHoverView,
  GraphFeatures.a11yFeatures,
  GraphFeatures.lassoSelect,
  GraphFeatures.limitBoundary
]);

export const previewMode = new Set([GraphFeatures.nodeHoverView, GraphFeatures.portHoverView, GraphFeatures.autoFit]);
