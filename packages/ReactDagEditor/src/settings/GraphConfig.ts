import { IEdgeConfig, IGroupConfig, IPortConfig, INodeConfig } from "../models/settings";
import { IGraphClipboard } from "./IGraphClipboard";
import { IGraphConfig } from "./IGraphConfig";

export class GraphConfig<NodeData = unknown, EdgeData = unknown, PortData = unknown>
  implements IGraphConfig<NodeData, EdgeData, PortData> {
  public readonly defaultEdgeShape;
  public readonly defaultNodeShape;
  public readonly defaultPortShape;
  public readonly defaultGroupShape;
  public readonly nodeConfigMap: ReadonlyMap<string, INodeConfig<NodeData, PortData>>;
  public readonly edgeConfigMap: ReadonlyMap<string, IEdgeConfig<EdgeData>>;
  public readonly portConfigMap: ReadonlyMap<string, IPortConfig<NodeData, EdgeData, PortData>>;
  public readonly groupConfigMap: ReadonlyMap<string, IGroupConfig>;
  public readonly clipboard: IGraphClipboard<NodeData, EdgeData, PortData>;

  public constructor(
    defaultEdgeShape: string,
    defaultNodeShape: string,
    defaultPortShape: string,
    defaultGroupShape: string,
    nodeConfigMap: ReadonlyMap<string, INodeConfig<NodeData, PortData>>,
    edgeConfigMap: ReadonlyMap<string, IEdgeConfig<EdgeData>>,
    portConfigMap: ReadonlyMap<string, IPortConfig<NodeData, EdgeData, PortData>>,
    groupConfigMap: ReadonlyMap<string, IGroupConfig>,
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

  public getClipboard(): IGraphClipboard<NodeData, EdgeData, PortData> {
    return this.clipboard;
  }

  public getEdgeConfigByName(name?: string): IEdgeConfig<EdgeData> | undefined {
    return this.edgeConfigMap.get(name || this.defaultEdgeShape);
  }

  public getGroupConfigByName(name?: string): IGroupConfig | undefined {
    return this.groupConfigMap.get(name || this.defaultGroupShape);
  }

  public getNodeConfigByName(name?: string): INodeConfig<NodeData, PortData> | undefined {
    return this.nodeConfigMap.get(name || this.defaultNodeShape);
  }

  public getPortConfigByName(name?: string): IPortConfig<NodeData, EdgeData, PortData> | undefined {
    return this.portConfigMap.get(name || this.defaultPortShape);
  }
}
