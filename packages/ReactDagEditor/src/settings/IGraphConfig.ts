import { IEdgeConfig, IGroupConfig, IPortConfig, INodeConfig } from "../models/settings";
import { IGraphClipboard } from "./IGraphClipboard";

export interface IGraphConfig<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  readonly defaultNodeShape: string;
  readonly defaultEdgeShape: string;
  readonly defaultPortShape: string;
  readonly defaultGroupShape: string;
  getNodeConfigByName(name?: string): INodeConfig<NodeData, PortData> | undefined;
  getEdgeConfigByName(name?: string): IEdgeConfig<EdgeData> | undefined;
  getPortConfigByName(name?: string): IPortConfig<NodeData, EdgeData, PortData> | undefined;
  getClipboard(): IGraphClipboard<NodeData, EdgeData, PortData>;
  getGroupConfigByName(name?: string): IGroupConfig | undefined;
}
