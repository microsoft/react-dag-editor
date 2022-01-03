import { RecordBase } from "record-class";
import { mapCow } from "../utils/array";
import type { $Complete } from "../utils/complete";
import { getPortPositionByPortId } from "../utils/getPortPosition";
import type { IGraphConfig } from "./config/types";
import type { IPoint } from "./geometry";
import type { ICanvasNode } from "./node";
import type { ICanvasPort } from "./port";
import { GraphNodeStatus } from "./status";

export interface INodeModel<NodeData = unknown, PortData = unknown>
  extends ICanvasNode<NodeData, PortData> {
  readonly portPositionCache?: Map<string, IPoint>;
  readonly prev?: string;
  readonly next?: string;
}

export class NodeModel<NodeData = unknown, PortData = unknown>
  extends RecordBase<
    INodeModel<NodeData, PortData>,
    NodeModel<NodeData, PortData>
  >
  implements $Complete<INodeModel<NodeData, PortData>>
{
  public readonly id!: string;
  public readonly x!: number;
  public readonly y!: number;
  public readonly name!: string;
  public readonly height: number | undefined = undefined;
  public readonly width: number | undefined = undefined;
  public readonly shape: string | undefined = undefined;
  public readonly status: GraphNodeStatus | undefined = undefined;
  public readonly automationId: string | undefined = undefined;
  public readonly ports: ReadonlyArray<ICanvasPort<PortData>> | undefined =
    undefined;
  public readonly portPositionCache = new Map<string, IPoint>();
  public readonly data: Readonly<NodeData> | undefined = undefined;
  public readonly ariaLabel: string | undefined = undefined;
  public readonly prev: string | undefined = undefined;
  public readonly next: string | undefined = undefined;

  public static fromJSON<NodeData = unknown, PortData = unknown>(
    source: ICanvasNode<NodeData, PortData>,
    prev: string | undefined = undefined,
    next: string | undefined = undefined
  ): NodeModel<NodeData, PortData> {
    return new NodeModel({
      ...source,
      prev,
      next,
      portPositionCache: new Map(),
    });
  }

  public getPort(id: string): ICanvasPort<PortData> | undefined {
    return this.ports?.find((port) => port.id === id);
  }

  public updateData(
    f: (data: Readonly<NodeData>) => Readonly<NodeData>
  ): NodeModel<NodeData, PortData> {
    if (!this.data) {
      return this;
    }
    const data = f(this.data);
    return this.data === data
      ? this
      : this.merge({
          data,
        });
  }

  public getPortPosition(
    portId: string,
    graphConfig: IGraphConfig
  ): IPoint | undefined {
    let point = this.portPositionCache.get(portId);
    if (!point) {
      point = getPortPositionByPortId(this, portId, graphConfig);
      if (point) {
        this.portPositionCache.set(portId, point);
      }
    }
    return point;
  }

  public hasPort(id: string): boolean {
    return Boolean(this.ports?.find((port) => port.id === id));
  }

  /**
   * @internal
   */
  public updatePositionAndSize(
    dummy: ICanvasNode
  ): NodeModel<NodeData, PortData> {
    const { x, y, width, height } = dummy;
    return this.merge({
      x,
      y,
      width: width ?? this.width,
      height: height ?? this.height,
    });
  }

  public updatePorts(
    f: (port: ICanvasPort<PortData>, index: number) => ICanvasPort<PortData>
  ): NodeModel<NodeData, PortData> {
    if (!this.ports) {
      return this;
    }
    const ports = mapCow(this.ports, f);

    return this.ports === ports
      ? this
      : this.merge({
          ports,
        });
  }

  public invalidCache(): NodeModel<NodeData, PortData> {
    return this.merge({
      portPositionCache: new Map(),
    });
  }

  protected override $$create(
    partial: INodeModel<NodeData, PortData>
  ): NodeModel<NodeData, PortData> {
    return new NodeModel(partial);
  }
}
