import * as React from "react";
import { GraphCanvasEvent, GraphContextMenuEvent, GraphEdgeEvent, GraphNodeEvent } from "../common/GraphEvent.constant";
import { GraphBehavior, IDispatchCallback, IGraphState} from "../contexts/GraphStateContext";
import { GraphFeatures } from "../Features";
import {
  GraphPortState,
  ICanvasData,
  ICanvasEdge,
  ICanvasNode,
  ICanvasPort,
  IEvent
} from "../Graph.interface";
import { autoLayout, IAutoLayout } from "../libs";
import { GraphModel } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
import { IContainerRect, IViewport } from "../models/viewport";
import { IPosition } from "../testAPI";
import {
  filterSelectedItems,
  getNodeAndPortByPosition,
  getNodeRect,
  getVisibleNodes,
  getRenderedEdges,
  getRenderedNodes,
  IPoint,
  isNodeVisible,
  isPointVisible,
  IZoomFixPublicOption,
  IZoomPanSettings,
  resetState,
  updateState,
  ZoomDirection,
  isViewPortComplete,
  transformPoint
} from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { IPropsAPI } from "./IPropsAPI";
import { IPropsAPIInstance, noopInstance } from "./IPropsAPIInstance";

export class PropsAPI<NodeData, EdgeData, PortData> implements IPropsAPI<NodeData, EdgeData, PortData> {
  /**
   * @internal
   */
  public get _enabledFeatures(): Set<GraphFeatures> {
    return this.getInstance().enabledFeatures;
  }

  /**
   * @internal
   */
  public get _containerRect(): IContainerRect | undefined | null {
    return this.getInstance().containerRectRef.current;
  }

  /**
   * @internal
   */
  public get _containerRectRef(): React.RefObject<IContainerRect | undefined> {
    return this.getInstance().containerRectRef;
  }

  /**
   * @internal
   */
  public get _svgRef(): React.RefObject<SVGSVGElement> {
    return this.getInstance().svgRef;
  }

  /**
   * @internal
   */
  public readonly instanceRef = React.createRef<IPropsAPIInstance<NodeData, EdgeData, PortData> | null>();

  public getCssId(): string {
    return this.getInstance().graphId;
  }

  public isGraphReady(): boolean {
    return this.getInstance() !== noopInstance;
  }

  public getGraphBehavior(): GraphBehavior {
    return this.getInstance().state.behavior;
  }

  public getEnabledFeatures(): Set<GraphFeatures> {
    if (this.isGraphReady()) {
      return this.getInstance().enabledFeatures;
    }
    return new Set<GraphFeatures>();
  }

  public openContextMenu(position?: IPoint): void {
    this.dispatch({
      ...position,
      type: GraphContextMenuEvent.Open
    });
  }

  public closeContextMenu(): void {
    this.dispatch({
      type: GraphContextMenuEvent.Close
    });
  }

  /**
   * @deprecated
   * @param contextMenuPosition
   */
  public setIsVisibleContextMenu(contextMenuPosition?: IPosition | undefined | null): void {
    if (contextMenuPosition === null) {
      this.closeContextMenu();
    } else {
      this.openContextMenu(contextMenuPosition);
    }
  }

  public getNodeById(id: string): NodeModel<NodeData, PortData> | undefined {
    return this.getData().nodes.get(id);
  }

  public async layoutData(data: GraphModel, layoutParams: IAutoLayout = {}): Promise<GraphModel> {
    const { graphConfig } = this.getInstance();
    if (!graphConfig) {
      return data;
    }

    return autoLayout<NodeData, EdgeData, PortData>({
      ...layoutParams,
      graphConfig,
      data: this.getData()
    });
  }

  public async setDataWithAutoLayout(
    data: GraphModel<NodeData, EdgeData, PortData>,
    layoutParams: IAutoLayout = {}
  ): Promise<void> {
    const { graphConfig } = this.getInstance();
    if (!graphConfig) {
      return;
    }
    const nextData = await autoLayout<NodeData, EdgeData, PortData>({
      ...layoutParams,
      graphConfig,
      data
    });
    this.setData(nextData);
  }

  public async autoLayout(params: IAutoLayout = {}): Promise<void> {
    const { graphConfig } = this.getInstance();
    if (!graphConfig) {
      return;
    }
    const data = await autoLayout<NodeData, EdgeData, PortData>({
      ...params,
      graphConfig,
      data: this.getData()
    });
    this.setData(data);
  }

  public dispatch<Action = never>(
    action: IEvent<NodeData, EdgeData, PortData> | Action,
    callback?: IDispatchCallback<NodeData, EdgeData, PortData>
  ): void {
    this.getInstance().dispatch((action as unknown) as IEvent, callback);
  }

  public async dispatchAsync<Action = never>(
    action: IEvent<NodeData, EdgeData, PortData> | Action
  ): Promise<[IGraphState<NodeData, EdgeData, PortData>, IGraphState<NodeData, EdgeData, PortData>]> {
    return new Promise(resolve => {
      this.dispatch(action, (state, prevState) => resolve([state, prevState]));
    });
  }

  /**
   * @deprecated
   * @param nodes
   * @param pos
   * @param portRadius
   */
  public getNodeAndPortByPosition(
    nodes: Array<NodeModel<NodeData, PortData>>,
    pos: IPoint,
    portRadius: number
  ): {
    node: NodeModel<NodeData, PortData> | undefined;
    port: ICanvasPort<PortData> | undefined;
  } {
    const { graphConfig } = this.getInstance();
    return getNodeAndPortByPosition(graphConfig, nodes, pos, portRadius);
  }

  public addNode(node: ICanvasNode<NodeData, PortData>): boolean {
    const isAddNodeDisabled = !this._enabledFeatures.has(GraphFeatures.addNewNodes);
    if (isAddNodeDisabled) {
      return false;
    }
    this.dispatch({
      type: GraphNodeEvent.Add,
      node
    });
    return true;
  }

  public addEdge(edge: ICanvasEdge<EdgeData>): boolean {
    const isAddEdgeDisabled = !this._enabledFeatures.has(GraphFeatures.addNewEdges);
    if (isAddEdgeDisabled) {
      return false;
    }
    this.dispatch({
      type: GraphEdgeEvent.Add,
      edge
    });
    return true;
  }

  public updateNode(
    id: string,
    patch:
      | Partial<ICanvasNode<NodeData, PortData>>
      | ((node: ICanvasNode<NodeData, PortData>) => ICanvasNode<NodeData, PortData>)
  ): void {
    this.updateData(data =>
      data.updateNode(id, thisNode => ({
        ...thisNode,
        ...(typeof patch === "function" ? patch(thisNode) : patch)
      }))
    );
  }

  public updateNodeData(id: string, data: Partial<NodeData>): void {
    this.updateData(prevData =>
      prevData.updateNodeData(id, thisData => ({
        ...thisData,
        ...data
      }))
    );
  }

  public updateEdge(
    id: string,
    patch: Partial<ICanvasEdge<EdgeData>> | ((edge: ICanvasEdge<EdgeData>) => ICanvasEdge<EdgeData>)
  ): void {
    this.updateData(data =>
      data.updateEdge(id, thisEdge => ({
        ...thisEdge,
        ...(typeof patch === "function" ? patch(thisEdge) : patch)
      }))
    );
  }

  public updateEdgeData(id: string, data: Partial<EdgeData>): void {
    this.updateEdge(id, thisEdge => {
      return {
        ...thisEdge,
        data: {
          ...(thisEdge.data as EdgeData),
          ...data
        }
      };
    });
  }

  public updatePort(
    nodeId: string,
    portId: string,
    patch: Partial<ICanvasPort<PortData>> | ((port: ICanvasPort<PortData>) => ICanvasPort<PortData>)
  ): void {
    this.updateData(data =>
      data.updatePort(nodeId, portId, thisPort => ({
        ...thisPort,
        ...(typeof patch === "function" ? patch(thisPort) : patch)
      }))
    );
  }

  public updatePortData(nodeId: string, portId: string, data: Partial<PortData>): void {
    this.updatePort(nodeId, portId, thisPort => {
      return {
        ...thisPort,
        data: {
          ...(thisPort.data as PortData),
          ...data
        }
      };
    });
  }

  public selectNodeById(nodeId: string | string[]): void {
    const ids = typeof nodeId === "string" ? new Set([nodeId]) : new Set(nodeId);
    this.updateData(data => data.selectNodes(node => ids.has(node.id)));
  }

  public activatePortById(nodeId: string, portId: string): void {
    this.setPortStateById(nodeId, portId, GraphPortState.activated);
  }

  public setPortStateById(nodeId: string, portId: string, portState: GraphPortState): void {
    this.updatePort(nodeId, portId, updateState(resetState(portState)));
  }

  public centralizeNode(nodeId: string | string[]): void {
    const nodes = Array.isArray(nodeId) ? nodeId : [nodeId];
    this.dispatch({
      type: GraphNodeEvent.Centralize,
      nodes
    });
  }

  public locateNode(nodeId: string, position: IPoint): void {
    this.dispatch({
      type: GraphNodeEvent.Locate,
      nodes: [nodeId],
      position
    });
  }

  public delete(): boolean {
    if (!this._enabledFeatures.has(GraphFeatures.delete)) {
      return false;
    }
    this.dispatch({
      type: GraphCanvasEvent.Delete
    });
    return true;
  }

  public zoom(scale: number, direction?: ZoomDirection): void {
    return this.dispatch({
      type: GraphCanvasEvent.Zoom,
      scale,
      direction
    });
  }

  public pan(dx: number, dy: number): void {
    this.dispatch({
      type: GraphCanvasEvent.Pan,
      dx,
      dy
    });
  }

  public resetZoom(ensureNodeVisible = false): void {
    this.dispatch({
      type: GraphCanvasEvent.ResetViewPort,
      ensureNodeVisible
    });
  }

  public zoomTo(scale: number, anchor?: IPoint | undefined, direction?: ZoomDirection): void {
    this.dispatch({
      type: GraphCanvasEvent.ZoomTo,
      scale,
      anchor,
      direction
    });
  }

  public zoomToFit(option: Omit<IZoomFixPublicOption, "rect"> = {}): void {
    this.dispatch({
      ...option,
      type: GraphCanvasEvent.ZoomToFit
    });
  }

  public copy(): void {
    const { graphConfig } = this.getInstance();

    if (!graphConfig) {
      return;
    }

    const selectedData = filterSelectedItems(this.getData());
    const clipboard = graphConfig.getClipboard();

    clipboard.write(selectedData);
  }

  public paste(x?: number | IPoint, y?: number): boolean {
    let position: IPoint | undefined;
    if (typeof x === "number" && typeof y === "number") {
      position = { x, y };
    } else if (typeof x === "object") {
      position = x;
    }
    const { graphConfig } = this.getInstance();
    if (
      !graphConfig ||
      !this._enabledFeatures.has(GraphFeatures.addNewNodes) ||
      !this._enabledFeatures.has(GraphFeatures.addNewEdges)
    ) {
      return false;
    }
    const clipboard = graphConfig.getClipboard();
    const data = clipboard.read();

    if (!data) {
      return false;
    }

    this.dispatch({
      type: GraphCanvasEvent.Paste,
      data,
      position
    });
    return true;
  }

  public redo(): void {
    if (!this._enabledFeatures.has(GraphFeatures.undoStack)) {
      return;
    }

    this.dispatch({
      type: GraphCanvasEvent.Redo
    });
  }

  public undo(): void {
    if (!this._enabledFeatures.has(GraphFeatures.undoStack)) {
      return;
    }

    this.dispatch({
      type: GraphCanvasEvent.Undo
    });
  }

  public resetUndoStack(): void {
    this.dispatch({
      type: GraphCanvasEvent.ResetUndoStack
    });
  }

  public markSearchResults(matchesIds: string[]): void {
    const ids = new Set(matchesIds);
    this.updateData(data =>
      data.mapNodes(it =>
        it.update(node => {
          const isInSearchResults = ids.has(node.id);
          if (node.isInSearchResults !== isInSearchResults) {
            return {
              ...node,
              isInSearchResults
            };
          }
          return node;
        })
      )
    );
  }

  public markSearchHighlight(id: string): void {
    this.updateData(data =>
      data.mapNodes(it =>
        it.update(node => {
          const isCurrentSearchResult = id === node.id;
          if (node.isCurrentSearchResult !== isCurrentSearchResult) {
            return {
              ...node,
              isCurrentSearchResult
            };
          }
          return node;
        })
      )
    );
  }

  public openSidePanel(name: string, data?: unknown): void {
    const { panelContext } = this.getInstance();

    if (!panelContext) {
      return;
    }

    const prevPanelName = panelContext.state.name;
    const prevPanelConfig = prevPanelName ? panelContext.configList.get(prevPanelName) : null;
    const nextPanelConfig = panelContext.configList.get(name);

    panelContext.setState({
      name,
      data
    });

    if (prevPanelConfig && prevPanelConfig.panelDidDismiss) {
      prevPanelConfig.panelDidDismiss();
    }

    if (nextPanelConfig && nextPanelConfig.panelDidOpen) {
      nextPanelConfig.panelDidOpen();
    }
  }

  public dismissSidePanel(): void {
    const { panelContext } = this.getInstance();

    if (!panelContext) {
      return;
    }

    const prevPanelName = panelContext.state.name;
    const prevPanelConfig = prevPanelName ? panelContext.configList.get(prevPanelName) : null;

    panelContext.setState({
      name: undefined,
      data: null
    });

    if (prevPanelConfig && prevPanelConfig.panelDidDismiss) {
      prevPanelConfig.panelDidDismiss();
    }
  }

  public getVisiblePanelName(): string | void {
    const { panelContext } = this.getInstance();

    if (!panelContext) {
      return undefined;
    }

    return panelContext.state?.name;
  }

  public scrollIntoView(x: number, y: number): void {
    this.dispatch({
      type: GraphCanvasEvent.ScrollIntoView,
      x,
      y
    });
  }

  /**
   * @deprecated
   */
  public getZoomPanSettings(): IZoomPanSettings {
    return this.getViewPort();
  }

  public getViewPort(): IViewport {
    return this.getGraphState().viewport;
  }

  public getGraphSvgRef(): React.RefObject<SVGSVGElement> {
    return this._svgRef;
  }

  public getEventChannel(): EventChannel {
    return this.getInstance().eventChannel;
  }

  public getContainerRectRef(): React.RefObject<IContainerRect | undefined> {
    return this._containerRectRef;
  }

  /**
   * @deprecated
   * @param x
   * @param y
   */
  public getClientByPoint(x: number, y: number): IPoint {
    return transformPoint(x, y, this.getViewPort().transformMatrix);
  }

  public isNodeInViewPort(nodeId: string): boolean {
    const { graphConfig } = this.getInstance();
    if (!graphConfig) {
      return false;
    }

    const node = this.getNodeById(nodeId);

    if (!node) {
      return false;
    }

    const viewport = this.getViewPort();
    if (!isViewPortComplete(viewport)) {
      return false;
    }

    return isNodeVisible(node, viewport, graphConfig);
  }

  public getSelectedItems(): ICanvasData<NodeData, EdgeData, PortData> {
    return filterSelectedItems(this.getData());
  }

  public getState(): IGraphState<NodeData, EdgeData, PortData> {
    return this.getInstance().state as IGraphState<NodeData, EdgeData, PortData>;
  }

  public getData(): GraphModel<NodeData, EdgeData, PortData> {
    return this.getInstance().getData();
  }

  public getVisibleNodes(): ICanvasNode[] {
    const { graphConfig } = this.getInstance();
    if (!graphConfig) {
      return [];
    }

    const viewport = this.getViewPort();
    if (!isViewPortComplete(viewport)) {
      return [];
    }

    return getVisibleNodes(this.getData().nodes, viewport, graphConfig);
  }

  public getRenderedNodes(): ICanvasNode[] {
    return getRenderedNodes(this.getData().nodes, this.getViewPort());
  }

  public getRenderedEdges(): ICanvasEdge[] {
    const { graphConfig } = this.getInstance();
    if (!graphConfig) {
      return [];
    }
    const { edges, nodes } = this.getData();

    return getRenderedEdges(edges, nodes, graphConfig, this.getViewPort());
  }

  public setData(data: GraphModel<NodeData, EdgeData, PortData>): void {
    this.dispatch({
      type: GraphCanvasEvent.SetData,
      data
    });
  }

  public updateData(
    patch: (prevData: GraphModel<NodeData, EdgeData, PortData>) => GraphModel<NodeData, EdgeData, PortData>,
    shouldRecord = false
  ): void {
    this.dispatch({
      type: GraphCanvasEvent.UpdateData,
      updater: patch,
      shouldRecord
    });
  }

  public getGraphState(): IGraphState {
    return this.getInstance().state;
  }

  public getActiveKeys(): Set<string> {
    return this.getGraphState().activeKeys;
  }

  public isNodeFullVisible(nodeId: string): boolean {
    const { viewport, data } = this.getGraphState();
    const node = data.present.nodes.get(nodeId);
    const { graphConfig } = this.getInstance();
    if (!node || !graphConfig || !isViewPortComplete(viewport)) {
      return false;
    }
    const { x, y, width, height } = getNodeRect(node, graphConfig);
    return (
      isPointVisible({ x, y }, viewport) &&
      isPointVisible({ x: x + width, y }, viewport) &&
      isPointVisible({ x: x + width, y: y + height }, viewport) &&
      isPointVisible({ x, y: y + height }, viewport)
    );
  }

  /**
   * @internal
   */
  public getInstance(): IPropsAPIInstance<NodeData, EdgeData, PortData> {
    return (this.instanceRef.current ?? noopInstance) as IPropsAPIInstance<NodeData, EdgeData, PortData>;
  }
}
