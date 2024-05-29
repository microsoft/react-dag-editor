import type * as React from "react";
import type { ICanvasData, ICanvasGroup } from "../canvas";
import { ICanvasEdge } from "../edge";
import type { EdgeModel } from "../EdgeModel";
import type { IViewport } from "../geometry";
import type { GraphModel } from "../GraphModel";
import type { ICanvasNode } from "../node";
import type { NodeModel } from "../NodeModel";
import type { ICanvasPort } from "../port";

export interface IItemConfigArgs<T> {
  model: T;
  viewport: Required<IViewport>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INodeDrawArgs<NodeData = unknown, PortData = unknown>
  extends IItemConfigArgs<NodeModel<NodeData, PortData>> {}

export interface INodeConfig<NodeData = unknown, PortData = unknown> {
  render(args: INodeDrawArgs<NodeData, PortData>): React.ReactNode;
  renderDummy?(rect: ICanvasNode<NodeData, PortData>): React.ReactNode;
  renderStatic?(
    args: Omit<INodeDrawArgs<NodeData, PortData>, "viewport">
  ): React.ReactNode;
  getStyle?(rect: ICanvasNode<NodeData, PortData>): React.CSSProperties;
  getMinWidth(rect: Partial<ICanvasNode<NodeData, PortData>>): number;
  getMinHeight(rect: Partial<ICanvasNode<NodeData, PortData>>): number;
  getMaxWidth?(rect: Partial<ICanvasNode<NodeData, PortData>>): number;
  getMaxHeight?(rect: Partial<ICanvasNode<NodeData, PortData>>): number;
  renderTooltips?(args: INodeDrawArgs<NodeData, PortData>): React.ReactNode;
}

export interface IEdgeDrawArgs<T = unknown>
  extends IItemConfigArgs<EdgeModel<T>> {
  data: GraphModel;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface IEdgeConfig<T = unknown> {
  render(args: IEdgeDrawArgs<T>): React.ReactNode;
  renderWithTargetHint?(args: IEdgeDrawArgs<T>): React.ReactNode;
  renderWithSourceHint?(args: IEdgeDrawArgs<T>): React.ReactNode;
}

export interface IGetConnectableParams<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  model: ICanvasPort<PortData>;
  parentNode: NodeModel<NodeData, PortData>;
  anotherPort?: ICanvasPort<PortData> | undefined;
  anotherNode?: NodeModel<NodeData, PortData> | undefined;
  data: GraphModel<NodeData, EdgeData, PortData>;
}

export interface IPortDrawArgs<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> extends IItemConfigArgs<ICanvasPort<PortData>>,
    IGetConnectableParams<NodeData, EdgeData, PortData> {
  x: number;
  y: number;
}

export interface IGroupDrawArgs {
  group: ICanvasGroup;
  height: number;
  width: number;
}

export interface IPortConfig<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  render(args: IPortDrawArgs<NodeData, EdgeData, PortData>): React.ReactNode;
  getIsConnectable(
    params: IGetConnectableParams<NodeData, EdgeData, PortData>
  ): boolean | undefined;
  renderTooltips?(
    args: Omit<IPortDrawArgs<NodeData, EdgeData, PortData>, "setData">
  ): React.ReactNode;
}

export interface IGroupConfig {
  render(args: IGroupDrawArgs): React.ReactNode;
}

export interface IGraphClipboard<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  write(data: ICanvasData<NodeData, EdgeData, PortData>): void;
  read(): ICanvasData<NodeData, EdgeData, PortData> | null;
}

export interface IGraphConfig<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  getNodeConfig(
    node: ICanvasNode<NodeData, PortData>
  ): INodeConfig<ICanvasNode<NodeData, PortData>> | undefined;
  getEdgeConfig(edge: ICanvasEdge<EdgeData>): IEdgeConfig<EdgeData> | undefined;
  getPortConfig(
    port: ICanvasPort<PortData>
  ): IPortConfig<NodeData, EdgeData, PortData> | undefined;
  getGroupConfig(group: ICanvasGroup): IGroupConfig | undefined;
  getClipboard(): IGraphClipboard<NodeData, EdgeData, PortData>;
}
