import type * as React from "react";
import type { ICanvasData, ICanvasGroup } from "../canvas";
import type { ContentState } from "../ContentState";
import type { EdgeModel } from "../edge";
import type { IViewport } from "../geometry";
import type { ICanvasNode, INodeModel, NodeModel } from "../node";
import type { PortModel } from "../port";

export interface IItemConfigArgs<T> {
  model: T;
  viewport: Required<IViewport>;
}

export interface INodeDrawArgs extends IItemConfigArgs<NodeModel> {}

export interface INodeConfig {
  render(args: INodeDrawArgs): React.ReactNode;
  renderDummy?(rect: INodeModel): React.ReactNode;
  renderStatic?(args: Omit<INodeDrawArgs, "viewport">): React.ReactNode;
  getStyle?(rect: ICanvasNode): React.CSSProperties;
  getMinWidth(rect: Partial<ICanvasNode | INodeModel>): number;
  getMinHeight(rect: Partial<ICanvasNode | INodeModel>): number;
  renderTooltips?(args: INodeDrawArgs): React.ReactNode;
}

export interface IEdgeDrawArgs extends IItemConfigArgs<EdgeModel> {
  data: ContentState;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface IEdgeConfig {
  render(args: IEdgeDrawArgs): React.ReactNode;
  renderWithTargetHint?(args: IEdgeDrawArgs): React.ReactNode;
  renderWithSourceHint?(args: IEdgeDrawArgs): React.ReactNode;
}

export interface IGetConnectableParams {
  model: PortModel;
  parentNode: NodeModel;
  anotherPort?: PortModel | undefined;
  anotherNode?: NodeModel | undefined;
  data: ContentState;
}

export interface IPortDrawArgs
  extends IItemConfigArgs<PortModel>,
    IGetConnectableParams {
  x: number;
  y: number;
}

export interface IGroupDrawArgs {
  group: ICanvasGroup;
  height: number;
  width: number;
}

export interface IPortConfig {
  render(args: IPortDrawArgs): React.ReactNode;
  getIsConnectable(params: IGetConnectableParams): boolean | undefined;
  renderTooltips?(args: Omit<IPortDrawArgs, "setData">): React.ReactNode;
}

export interface IGroupConfig {
  render(args: IGroupDrawArgs): React.ReactNode;
}

export interface IGraphClipboard {
  write(data: ICanvasData): void;
  read(): ICanvasData | null;
}

export interface IGraphConfig {
  readonly defaultNodeShape: string;
  readonly defaultEdgeShape: string;
  readonly defaultPortShape: string;
  readonly defaultGroupShape: string;
  getNodeConfigByName(name?: string): INodeConfig | undefined;
  getEdgeConfigByName(name?: string): IEdgeConfig | undefined;
  getPortConfigByName(name?: string): IPortConfig | undefined;
  getClipboard(): IGraphClipboard;
  getGroupConfigByName(name?: string): IGroupConfig | undefined;
}
