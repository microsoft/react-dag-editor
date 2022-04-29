import type {
  IEdgeConfig,
  IGraphClipboard,
  IGraphConfig,
  IGroupConfig,
  INodeConfig,
  IPortConfig,
} from "./types";

export class GraphConfig implements IGraphConfig {
  public readonly defaultEdgeShape;
  public readonly defaultNodeShape;
  public readonly defaultPortShape;
  public readonly defaultGroupShape;
  public readonly nodeConfigMap: ReadonlyMap<string, INodeConfig>;
  public readonly edgeConfigMap: ReadonlyMap<string, IEdgeConfig>;
  public readonly portConfigMap: ReadonlyMap<string, IPortConfig>;
  public readonly groupConfigMap: ReadonlyMap<string, IGroupConfig>;
  public readonly clipboard: IGraphClipboard;

  public constructor(
    defaultEdgeShape: string,
    defaultNodeShape: string,
    defaultPortShape: string,
    defaultGroupShape: string,
    nodeConfigMap: ReadonlyMap<string, INodeConfig>,
    edgeConfigMap: ReadonlyMap<string, IEdgeConfig>,
    portConfigMap: ReadonlyMap<string, IPortConfig>,
    groupConfigMap: ReadonlyMap<string, IGroupConfig>,
    clipboard: IGraphClipboard
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

  public getClipboard(): IGraphClipboard {
    return this.clipboard;
  }

  public getEdgeConfigByName(name?: string): IEdgeConfig | undefined {
    return this.edgeConfigMap.get(name || this.defaultEdgeShape);
  }

  public getGroupConfigByName(name?: string): IGroupConfig | undefined {
    return this.groupConfigMap.get(name || this.defaultGroupShape);
  }

  public getNodeConfigByName(name?: string): INodeConfig | undefined {
    return this.nodeConfigMap.get(name || this.defaultNodeShape);
  }

  public getPortConfigByName(name?: string): IPortConfig | undefined {
    return this.portConfigMap.get(name || this.defaultPortShape);
  }
}
