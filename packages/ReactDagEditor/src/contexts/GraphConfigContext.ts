/* eslint-disable no-console */
import * as React from "react";
import { IGraphClipBoard } from "../built-in/defaultClipboard";
import { ICanvasGroup } from "../models/canvas";
import { ICanvasEdge } from "../models/edge";
import { EdgeModel } from "../models/EdgeModel";
import { IViewport } from "../models/geometry";
import { GraphModel } from "../models/GraphModel";
import { ICanvasNode } from "../models/node";
import { NodeModel } from "../models/NodeModel";
import { ICanvasPort } from "../models/port";
import { ITheme } from "./ThemeContext";

export interface IItemConfigArgs<T> {
  model: T;
  theme: ITheme;
  viewport: Required<IViewport>;
}

export interface INodeDrawArgs<NodeData = unknown, PortData = unknown>
  extends IItemConfigArgs<NodeModel<NodeData, PortData>> {}

export interface IRectConfig<T> {
  portShape?: string;
  render(args: IItemConfigArgs<T>): React.ReactNode;
  renderDummy?(rect: T, theme: ITheme): React.ReactNode;
  renderStatic?(
    args: Omit<IItemConfigArgs<T>, "setData" | "containerRect" | "zoomPanSettings" | "viewport">
  ): React.ReactNode;
  getStyle?(rect: T, theme: ITheme): React.CSSProperties;
  getMinWidth(rect: T): number;
  getMinHeight(rect: T): number;
  renderTooltips?(args: Omit<IItemConfigArgs<T>, "setData">): React.ReactNode;
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

export interface IGraphConfig<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  defaultNodeShape: string;
  defaultEdgeShape: string;
  defaultPortShape: string;
  defaultGroupShape: string;
  registerNode(name: string, config: IRectConfig<ICanvasNode<NodeData>>): void;
  getNodeConfigByName(name?: string): IRectConfig<ICanvasNode<NodeData>> | undefined;
  registerEdge(name: string, config: IEdgeConfig<EdgeData>): void;
  getEdgeConfigByName(name?: string): IEdgeConfig<EdgeData> | undefined;
  registerPort(name: string, config: IPortConfig<NodeData, EdgeData, PortData>): void;
  getPortConfigByName(name?: string): IPortConfig<NodeData, EdgeData, PortData> | undefined;
  registerClipboard(clipboard: IGraphClipBoard<NodeData, EdgeData, PortData>): void;
  getClipboard(): IGraphClipBoard<NodeData, EdgeData, PortData>;
  getGlobalEventTarget(): Window | Element;
  registerGroup(name: string, config: IGroupConfig): void;
  getGroupConfigByName(name?: string): IGroupConfig | undefined;
}

export class GraphConfig<NodeData = unknown, EdgeData = unknown, PortData = unknown>
  implements IGraphConfig<NodeData, EdgeData, PortData> {
  public defaultEdgeShape = "default";
  public defaultNodeShape = "default";
  public defaultPortShape = "default";
  public defaultGroupShape = "default";
  private readonly nodeConfigMap = new Map<string, IRectConfig<ICanvasNode>>();
  private readonly edgeConfigMap = new Map<string, IEdgeConfig<EdgeData>>();
  private readonly portConfigMap = new Map<string, IPortConfig<NodeData, EdgeData, PortData>>();
  private readonly groupConfigMap = new Map<string, IGroupConfig>();
  private clipboard?: IGraphClipBoard<NodeData, EdgeData, PortData>;
  private readonly globalEventTarget: Window | Element;

  public constructor(globalEventTarget: Window | Element) {
    this.globalEventTarget = globalEventTarget;
  }

  public registerNode(name: string, config: IRectConfig<ICanvasNode>): void {
    this.nodeConfigMap.set(name, config);
  }

  public getNodeConfigByName(name?: string): IRectConfig<ICanvasNode> | undefined {
    return this.nodeConfigMap.get(name || this.defaultNodeShape);
  }

  public registerEdge(name: string, config: IEdgeConfig<EdgeData>): void {
    this.edgeConfigMap.set(name, config);
  }

  public getEdgeConfigByName(name?: string): IEdgeConfig<EdgeData> | undefined {
    return this.edgeConfigMap.get(name || this.defaultEdgeShape);
  }

  public registerPort(name: string, config: IPortConfig<NodeData, EdgeData, PortData>): void {
    this.portConfigMap.set(name, config);
  }

  public getPortConfigByName(name?: string): IPortConfig<NodeData, EdgeData, PortData> | undefined {
    return this.portConfigMap.get(name || this.defaultPortShape);
  }

  public registerClipboard(clipboard: IGraphClipBoard<NodeData, EdgeData, PortData>): void {
    this.clipboard = clipboard;
  }

  public getClipboard(): IGraphClipBoard<NodeData, EdgeData, PortData> {
    if (!this.clipboard) {
      throw new Error("No clipboard registered!");
    }

    return this.clipboard;
  }

  public getGlobalEventTarget(): Window | Element {
    return this.globalEventTarget;
  }

  public registerGroup(name: string, config: IGroupConfig): void {
    this.groupConfigMap.set(name, config);
  }

  public getGroupConfigByName(name?: string): IGroupConfig | undefined {
    return this.groupConfigMap.get(name || this.defaultGroupShape);
  }
}

export const defaultGraphConfigContext: IGraphConfig = {
  get defaultNodeShape(): string {
    console.warn(
      "loading defaultNodeShape from default GraphConfig. It is probably caused by using GraphContext without ReactDagEditor component rendered."
    );

    return "default";
  },
  get defaultEdgeShape(): string {
    console.warn(
      "loading defaultEdgeShape from default GraphConfig. It is probably caused by using GraphContext without ReactDagEditor component rendered."
    );

    return "default";
  },
  get defaultPortShape(): string {
    console.warn(
      "loading defaultPortShape from default GraphConfig. It is probably caused by using GraphContext without ReactDagEditor component rendered."
    );

    return "default";
  },
  get defaultGroupShape(): string {
    console.warn(
      "loading defaultGroupShape from default GraphConfig. It is probably caused by using GraphContext without ReactDagEditor component rendered."
    );

    return "default";
  },
  registerNode: () => {
    console.warn(
      "registerNode is NOOP now. Please check if you are using RegisterNode without ReactDagEditor rendered"
    );
  },
  getNodeConfigByName: () => undefined,
  registerEdge: () => {
    console.warn(
      "registerEdge is NOOP now. Please check if you are using RegisterNode without ReactDagEditor rendered"
    );
  },
  getEdgeConfigByName: () => undefined,
  registerPort: () => {
    console.warn(
      "registerPort is NOOP now. Please check if you are using RegisterNode without ReactDagEditor rendered"
    );
  },
  getPortConfigByName: () => undefined,
  registerClipboard: () => {
    console.warn(
      "registerClipboard is NOOP now. Please check if you are using RegisterNode without ReactDagEditor rendered"
    );
  },
  getClipboard: () => (({} as unknown) as IGraphClipBoard),
  getGlobalEventTarget: () => window,
  registerGroup: () => {
    console.warn(
      "registerGroup is NOOP now. Please check if you are using RegisterNode without ReactDagEditor rendered"
    );
  },
  getGroupConfigByName: () => undefined
};

export const emptyNodeConfig = {
  render(): null {
    return null;
  },
  getMinHeight(): number {
    return 0;
  },
  getMinWidth(): number {
    return 0;
  }
};

export const GraphConfigContext = React.createContext<IGraphConfig>(defaultGraphConfigContext);
