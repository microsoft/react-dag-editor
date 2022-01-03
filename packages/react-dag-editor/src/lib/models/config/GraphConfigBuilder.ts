import {
  DefaultClipboard,
  defaultPort,
  DefaultStorage,
  line,
  rect,
} from "../../built-in";
import { defaultGroup } from "../../built-in/defaultGroup";
import { GraphConfig } from "./GraphConfig";
import type {
  IEdgeConfig,
  IGraphClipboard,
  IGroupConfig,
  INodeConfig,
  IPortConfig,
} from "./types";

export class GraphConfigBuilder<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  private defaultEdgeShape: string;
  private defaultNodeShape: string;
  private defaultPortShape: string;
  private defaultGroupShape: string;
  private readonly nodeConfigMap: Map<string, INodeConfig<NodeData, PortData>>;
  private readonly edgeConfigMap: Map<string, IEdgeConfig<EdgeData>>;
  private readonly portConfigMap: Map<
    string,
    IPortConfig<NodeData, EdgeData, PortData>
  >;
  private readonly groupConfigMap: Map<string, IGroupConfig>;
  private clipboard: IGraphClipboard<NodeData, EdgeData, PortData>;

  private constructor(
    defaultEdgeShape: string,
    defaultNodeShape: string,
    defaultPortShape: string,
    defaultGroupShape: string,
    nodeConfigMap: Map<string, INodeConfig<NodeData, PortData>>,
    edgeConfigMap: Map<string, IEdgeConfig<EdgeData>>,
    portConfigMap: Map<string, IPortConfig<NodeData, EdgeData, PortData>>,
    groupConfigMap: Map<string, IGroupConfig>,
    clipboard: IGraphClipboard<NodeData, EdgeData, PortData>
  ) {
    this.defaultEdgeShape = defaultEdgeShape;
    this.defaultNodeShape = defaultNodeShape;
    this.defaultPortShape = defaultPortShape;
    this.defaultGroupShape = defaultGroupShape;
    this.nodeConfigMap = nodeConfigMap;
    this.edgeConfigMap = edgeConfigMap;
    this.portConfigMap = portConfigMap;
    this.groupConfigMap = groupConfigMap;
    this.clipboard = clipboard;
  }

  public static default(): GraphConfigBuilder {
    return new GraphConfigBuilder(
      "default",
      "default",
      "default",
      "default",
      new Map().set("default", rect),
      new Map().set("default", line),
      new Map().set("default", defaultPort),
      new Map().set("default", defaultGroup),
      new DefaultClipboard(new DefaultStorage())
    );
  }

  public static from(graphConfig: GraphConfig): GraphConfigBuilder {
    return new GraphConfigBuilder(
      graphConfig.defaultEdgeShape,
      graphConfig.defaultNodeShape,
      graphConfig.defaultPortShape,
      graphConfig.defaultGroupShape,
      new Map(graphConfig.nodeConfigMap),
      new Map(graphConfig.edgeConfigMap),
      new Map(graphConfig.portConfigMap),
      new Map(graphConfig.groupConfigMap),
      graphConfig.clipboard
    );
  }

  public withDefaultEdgeShape(
    shape: string
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.defaultEdgeShape = shape;
    return this;
  }

  public withDefaultNodeShape(
    shape: string
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.defaultNodeShape = shape;
    return this;
  }

  public withDefaultPortShape(
    shape: string
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.defaultPortShape = shape;
    return this;
  }

  public withDefaultGroupShape(
    shape: string
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.defaultGroupShape = shape;
    return this;
  }

  public withClipboard(
    clipboard: IGraphClipboard<NodeData, EdgeData, PortData>
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.clipboard = clipboard;
    return this;
  }

  public registerNode(
    name: string,
    config: INodeConfig<NodeData, PortData>
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.nodeConfigMap.set(name, config);
    return this;
  }

  public registerEdge(
    name: string,
    config: IEdgeConfig<EdgeData>
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.edgeConfigMap.set(name, config);
    return this;
  }

  public registerPort(
    name: string,
    config: IPortConfig<NodeData, EdgeData, PortData>
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.portConfigMap.set(name, config);
    return this;
  }

  public registerGroup(
    name: string,
    config: IGroupConfig
  ): GraphConfigBuilder<NodeData, EdgeData, PortData> {
    this.groupConfigMap.set(name, config);
    return this;
  }

  public build(): GraphConfig<NodeData, EdgeData, PortData> {
    return new GraphConfig(
      this.defaultEdgeShape,
      this.defaultNodeShape,
      this.defaultPortShape,
      this.defaultGroupShape,
      new Map(this.nodeConfigMap),
      new Map(this.edgeConfigMap),
      new Map(this.portConfigMap),
      new Map(this.groupConfigMap),
      this.clipboard
    );
  }
}
