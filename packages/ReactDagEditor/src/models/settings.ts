import * as React from "react";
import { ITheme } from "../contexts";
import { ICanvasGroup } from "./canvas";
import { ICanvasEdge } from "./edge";
import { EdgeModel } from "./EdgeModel";
import { IViewport } from "./geometry";
import { GraphModel } from "./GraphModel";
import { ICanvasNode } from "./node";
import { NodeModel } from "./NodeModel";
import { ICanvasPort } from "./port";

export interface IItemConfigArgs<T> {
  model: T;
  theme: ITheme;
  viewport: Required<IViewport>;
}

export interface INodeDrawArgs<NodeData = unknown, PortData = unknown>
  extends IItemConfigArgs<NodeModel<NodeData, PortData>> {}

export interface INodeConfig<NodeData = unknown, PortData = unknown> {
  render(args: INodeDrawArgs<NodeData, PortData>): React.ReactNode;
  renderDummy?(rect: ICanvasNode<NodeData, PortData>, theme: ITheme): React.ReactNode;
  renderStatic?(args: Omit<INodeDrawArgs<NodeData, PortData>, "viewport">): React.ReactNode;
  getStyle?(rect: ICanvasNode<NodeData, PortData>, theme: ITheme): React.CSSProperties;
  getMinWidth(rect: ICanvasNode<NodeData, PortData>): number;
  getMinHeight(rect: ICanvasNode<NodeData, PortData>): number;
  renderTooltips?(args: INodeDrawArgs<NodeData, PortData>): React.ReactNode;
}

export interface IEdgeDrawArgs<T = unknown> extends IItemConfigArgs<EdgeModel<T>> {
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
  getStyle?(edge: ICanvasEdge, theme: ITheme): React.CSSProperties;
}

export interface IGetConnectableParams<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  model: ICanvasPort<PortData>;
  parentNode: NodeModel<NodeData, PortData>;
  anotherPort?: ICanvasPort<PortData> | undefined;
  anotherNode?: NodeModel<NodeData, PortData> | undefined;
  data: GraphModel<NodeData, EdgeData, PortData>;
}

export interface IPortDrawArgs<NodeData = unknown, EdgeData = unknown, PortData = unknown>
  extends IItemConfigArgs<ICanvasPort<PortData>>,
    IGetConnectableParams<NodeData, EdgeData, PortData> {
  x: number;
  y: number;
}

export interface IGroupDrawArgs {
  group: ICanvasGroup;
  height: number;
  width: number;
}

export interface IPortConfig<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  render(args: IPortDrawArgs<NodeData, EdgeData, PortData>): React.ReactNode;
  getIsConnectable(params: IGetConnectableParams<NodeData, EdgeData, PortData>): boolean | undefined;
  renderTooltips?(args: Omit<IPortDrawArgs<NodeData, EdgeData, PortData>, "setData">): React.ReactNode;
}

export interface IGroupConfig {
  render(args: IGroupDrawArgs): React.ReactNode;
}
