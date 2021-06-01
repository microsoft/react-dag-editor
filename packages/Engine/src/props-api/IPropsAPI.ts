import * as React from "react";
import { GraphBehavior, IDispatchCallback, IGraphState} from "../contexts/GraphStateContext";
import {
  GraphPortState,
  ICanvasData,
  ICanvasEdge,
  ICanvasNode,
  ICanvasPort,
  IEvent
} from "../Graph.interface";
import { GraphModel } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
import { IContainerRect, IViewport } from "../models/viewport";
import { IPoint, IZoomFixPublicOption, IZoomPanSettings, ZoomDirection } from "../utils";

import { IAutoLayout } from "../libs";
import { GraphFeatures } from "../Features";

export interface IPropsAPI<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  /**
   * dispatch graph action, e.x: update GraphModel data, or mark the activate key or inactivate key of keyboard
   *
   * @param action
   */
  dispatch<Action = never>(
    action: IEvent<NodeData, EdgeData, PortData> | Action,
    callback?: IDispatchCallback<NodeData, EdgeData, PortData>
  ): void;
  /**
   * dispatch graph action, returns a Promise instead of accepting a callback as second argument
   *
   * @param action
   */
  dispatchAsync<Action = never>(
    action: IEvent<NodeData, EdgeData, PortData> | Action
  ): Promise<[IGraphState<NodeData, EdgeData, PortData>, IGraphState<NodeData, EdgeData, PortData>]>;
  /**
   * check if the graph has mounted
   */
  isGraphReady(): boolean;
  /**
   * get graph behavior, e.x: dragging, panning, multiSelect, connecting, addingNode or default
   */
  getGraphBehavior(): GraphBehavior;
  /**
   * get enabled features of the graph
   */
  getEnabledFeatures(): Set<GraphFeatures>;
  openContextMenu(position?: IPoint): void;
  closeContextMenu(): void;
  /**
   * set visibility of the context menu
   *
   * @deprecated
   * @param contextMenuPosition coordinate of the context menu
   */
  setIsVisibleContextMenu(contextMenuPosition?: IPoint | undefined | null): void;
  /**
   * get node by nodeId
   *
   * @param id node id
   */
  getNodeById(id: string): NodeModel<NodeData, PortData> | undefined;
  /**
   * get autolayout GraphModel data
   *
   * @param data original GraphModel data
   * @param layoutParams
   */
  layoutData(data: GraphModel, layoutParams?: IAutoLayout): Promise<GraphModel>;
  /**
   * auto layout with current GraphModel data
   *
   * @param params
   */
  autoLayout(params?: IAutoLayout): Promise<void>;
  /**
   * auto layout using a given GraphModel data
   *
   * @param data
   * @param layoutParams
   */
  setDataWithAutoLayout(data: GraphModel, layoutParams?: IAutoLayout): Promise<void>;
  /**
   * get node nd port by coordinate
   *
   * @deprecated
   * @param nodes all nodes
   * @param position (x,y) coordinate
   * @param portRadius port radius
   */
  getNodeAndPortByPosition(
    nodes: Array<NodeModel<NodeData, PortData>>,
    position: IPoint,
    portRadius: number
  ): {
    node: NodeModel<NodeData, PortData> | undefined;
    port: ICanvasPort<PortData> | undefined;
  };
  /**
   * get current GraphModel data
   */
  getData(): GraphModel<NodeData, EdgeData, PortData>;
  /**
   * add node to the data
   *
   * @param node the node to be added
   */
  addNode(node: ICanvasNode<NodeData, PortData>): boolean;
  /**
   * add edge to the data
   *
   * @param edge the edge to be added
   */
  addEdge(edge: ICanvasEdge<EdgeData>): boolean;
  /**
   * update node with a given patch
   *
   * @param id node id
   * @param patch the patch to be updated
   */
  updateNode(
    id: string,
    patch:
      | Partial<ICanvasNode<NodeData, PortData>>
      | ((node: ICanvasNode<NodeData, PortData>) => ICanvasNode<NodeData, PortData>)
  ): void;
  /**
   * update the data of the node
   *
   * @param id node id
   * @param data the patch of the nodeData to be updated
   */
  updateNodeData(id: string, data: Partial<NodeData>): void;
  /**
   * update edge with a given patch
   *
   * @param id edge id
   * @param patch the patch to be updated
   */
  updateEdge(
    id: string,
    patch: Partial<ICanvasEdge<EdgeData>> | ((edge: ICanvasEdge<EdgeData>) => ICanvasEdge<EdgeData>)
  ): void;
  /**
   * update the data of the edge
   *
   * @param id edge id
   * @param data the patch of the edgeData to be updated
   */
  updateEdgeData(id: string, data: Partial<EdgeData>): void;
  /**
   * update port with a given patch
   *
   * @param nodeId node id
   * @param portId port id
   * @param patch the patch of the port to be updated
   */
  updatePort(
    nodeId: string,
    portId: string,
    patch: Partial<ICanvasPort<PortData>> | ((port: ICanvasPort<PortData>) => ICanvasPort<PortData>)
  ): void;
  /**
   * update the data of the port
   *
   * @param nodeId node id
   * @param portId port id
   * @param data the patch of the portData to be updated
   */
  updatePortData(nodeId: string, portId: string, data: Partial<PortData>): void;
  /**
   * select node (set node as selected state) by node id
   *
   * @param nodeId
   */
  selectNodeById(nodeId: string | string[]): void;
  /**
   * activate port (set port as activated state) by port id
   *
   * @param nodeId
   * @param portId
   */
  activatePortById(nodeId: string, portId: string): void;
  /**
   * set port state
   *
   * @param nodeId
   * @param portId
   * @param portState port state of enum GraphPortState
   */
  setPortStateById(nodeId: string, portId: string, portState: GraphPortState): void;
  /**
   * centralize node in the canvas
   *
   * @param nodeId
   */
  centralizeNode(nodeId: string | string[]): void;
  /**
   * locate node to the specific position of the canvas
   *
   * @param nodeId
   * @param position
   */
  locateNode(nodeId: string, position: IPoint): void;
  /**
   * delete selected item(s)
   */
  delete(): boolean;
  /**
   * pan the graph
   *
   * @param dx distance difference on direction X
   * @param dy distance difference on direction Y
   */
  pan(dx: number, dy: number): void;
  /**
   * zoom the graph by the scale and direction
   *
   * @param scale zoom by multiple [scale]
   * @param direction X: zoom horizontal, Y: zoom vertical
   */
  zoom(scale: number, direction?: ZoomDirection): void;
  /**
   * reset zoom
   *
   * @param ensureNodesVisible whether to ensure that any nodes are visible, default false
   */
  resetZoom(ensureNodesVisible?: boolean): void;
  /**
   * zoom to [scale]
   *
   * @param scale the scale to zoom to
   * @param anchor zoom anchor
   * @param direction X: zoom horizontal, Y: zoom vertical
   */
  zoomTo(scale: number, anchor?: IPoint | undefined, direction?: ZoomDirection): void;
  /**
   * Set zoom to fit the container or the given size.
   *
   * @returns scale
   */
  zoomToFit(option?: IZoomFixPublicOption): void;
  /**
   * copy the selected item(s)
   */
  copy(): void;
  /**
   * paste the copied item(s) to the position (x, y)
   *
   * @param x
   * @param y
   */
  paste(point?: IPoint): boolean;
  /**
   * paste the copied item(s) to the position (x, y)
   *
   * @deprecated
   * @param x
   * @param y
   */
  paste(x?: number, y?: number): boolean;
  /**
   * redo a next action
   */
  redo(): void;
  /**
   * undo a previous action
   */
  undo(): void;
  /**
   * mark the search result of the nodes (mark ICanvasNode.isInSearchResults as true)
   *
   * @param matchesIds node id(s) to be marked
   */
  markSearchResults(matchesIds: string[]): void;
  /**
   * mark the search highlight of the nodes (mark ICanvasNode.isCurrentSearchResult as true)
   *
   * @param id node id to be marked
   */
  markSearchHighlight(id: string): void;
  /**
   * open the side panel
   *
   * @param name the name of the side panel to open
   * @param data the parameter to transfer to the "render" function in the panel class
   */
  openSidePanel(name: string, data?: unknown): void;
  /**
   * dismiss side panel
   */
  dismissSidePanel(): void;
  /**
   * get the name of current visible side panel
   */
  getVisiblePanelName(): string | void;
  /**
   * Scroll the point (x, y) into view if the point is out of the view
   *
   * @param x
   * @param y
   */
  scrollIntoView(x: number, y: number): void;
  /**
   * get zoomPanSettings (transformMatrix)
   *
   * @deprecated
   */
  getZoomPanSettings(): IZoomPanSettings;
  getViewport(): IViewport;
  /**
   * get the svg ref object
   */
  getGraphSvgRef(): React.RefObject<SVGSVGElement>;
  /**
   * get the graph container ref
   */
  getContainerRectRef(): React.RefObject<IContainerRect | undefined>;
  /**
   * get client point by a given (x, y) coordinate
   *
   * @param x
   * @param y
   */
  getClientByPoint(x: number, y: number): IPoint;
  /**
   * check if the node is in the viewport
   *
   * @param nodeId
   */
  isNodeInViewport(nodeId: string): boolean;
  /**
   * get selected item(s)
   */
  getSelectedItems(): ICanvasData<NodeData, EdgeData, PortData>;
  /**
   * get visible nodes
   */
  getVisibleNodes(): ICanvasNode[];
  /**
   * get the real rendered nodes in the canvas (because of the virtualization, we maybe not render all of the nodes/edges)
   */
  getRenderedNodes(): ICanvasNode[];
  /**
   * get the real rendered edges in the canvas (because of the virtualization, we maybe not render all of the nodes/edges)
   */
  getRenderedEdges(): ICanvasEdge[];
  /**
   * get graphId of the graph container
   */
  getCssId(): string;
  /**
   * reset the undo/redo stack
   */
  resetUndoStack(): void;
  /**
   * set GraphModel data
   *
   * @param data
   * @param shouldRecord
   */
  setData(data: GraphModel<NodeData, EdgeData, PortData>, shouldRecord?: boolean): void;
  /**
   * update GraphModel data using prev data
   *
   * @param patch
   * @param shouldRecord
   */
  updateData(
    patch: (prevData: GraphModel<NodeData, EdgeData, PortData>) => GraphModel<NodeData, EdgeData, PortData>,
    shouldRecord?: boolean
  ): void;
  /**
   * get graph current state
   */
  getGraphState(): IGraphState;
  /**
   * get the current active key(s) of keyboard
   */
  getActiveKeys(): Set<string>;

  isNodeFullVisible(nodeId: string): boolean;
}
