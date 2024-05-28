import {
  DefaultClipboard,
  defaultPort,
  DefaultStorage,
  line,
  rect,
} from "../../built-in";
import { ICanvasGroup } from "../canvas";
import { ICanvasEdge } from "../edge";
import { ICanvasNode } from "../node";
import { ICanvasPort } from "../port";
import type {
  IEdgeConfig,
  IGraphClipboard,
  IGraphConfig,
  IGroupConfig,
  INodeConfig,
  IPortConfig,
} from "./types";

export class GraphConfigBuilder<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  private readonly draft: IGraphConfig<NodeData, EdgeData, PortData>;

  private constructor() {
    const storage = new DefaultStorage();
    const defaultClipboard = new DefaultClipboard<NodeData, EdgeData, PortData>(
      storage
    );
    this.draft = {
      getNodeConfig: () => rect,
      getEdgeConfig: () => line,
      getPortConfig: () => defaultPort,
      getGroupConfig: () => undefined,
      getClipboard: () => defaultClipboard,
    };
  }

  public static default(): GraphConfigBuilder {
    return new GraphConfigBuilder();
  }

  public static from(graphConfig: IGraphConfig): GraphConfigBuilder {
    return new GraphConfigBuilder()
      .registerNode(graphConfig.getNodeConfig.bind(graphConfig))
      .registerEdge(graphConfig.getEdgeConfig.bind(graphConfig))
      .registerPort(graphConfig.getPortConfig.bind(graphConfig))
      .registerGroup(graphConfig.getGroupConfig.bind(graphConfig))
      .registerClipboard(graphConfig.getClipboard.bind(graphConfig));
  }

  public registerNode(
    getConfig: (
      node: ICanvasNode<NodeData, PortData>
    ) => INodeConfig<ICanvasNode<NodeData, PortData>> | undefined
  ): this {
    this.draft.getNodeConfig = getConfig;
    return this;
  }

  public registerEdge(
    getConfig: (
      edge: ICanvasEdge<EdgeData>
    ) => IEdgeConfig<EdgeData> | undefined
  ): this {
    this.draft.getEdgeConfig = getConfig;
    return this;
  }

  public registerPort(
    getConfig: (
      port: ICanvasPort<PortData>
    ) => IPortConfig<NodeData, EdgeData, PortData> | undefined
  ): this {
    this.draft.getPortConfig = getConfig;
    return this;
  }

  public registerGroup(
    getConfig: (group: ICanvasGroup) => IGroupConfig | undefined
  ): this {
    this.draft.getGroupConfig = getConfig;
    return this;
  }

  public registerClipboard(
    getClipboard: () => IGraphClipboard<NodeData, EdgeData, PortData>
  ): this {
    this.draft.getClipboard = getClipboard;
    return this;
  }

  public build(): IGraphConfig {
    return this.draft;
  }
}
