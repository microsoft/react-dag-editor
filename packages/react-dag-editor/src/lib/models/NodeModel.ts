import record from "record-class/macro";
import {
  IWithPropertiesRecord,
  Properties,
  ReadonlyProperties,
  WithPropertiesRecord,
} from "../properties";
import { mapCow } from "../utils/array";
import type { $Complete } from "../utils/complete";
import { getPortPositionByPortId } from "../utils/getPortPosition";
import type { IGraphConfig } from "./config/types";
import type { IPoint } from "./geometry";
import type { ICanvasNode } from "./node";
import { IPortModel, PortModel } from "./PortModel";
import { GraphNodeStatus } from "./status";

export interface INodeModel
  extends Omit<ICanvasNode, "ports" | "properties">,
    IWithPropertiesRecord {
  readonly portPositionCache?: Map<string, IPoint>;
  readonly prev?: string;
  readonly next?: string;
  readonly ports?: ReadonlyArray<PortModel>;
}

@record
export class NodeModel
  extends WithPropertiesRecord<INodeModel, NodeModel>
  implements $Complete<INodeModel>
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
  public readonly ports: ReadonlyArray<PortModel> | undefined = undefined;
  public readonly portPositionCache = new Map<string, IPoint>();
  public readonly ariaLabel: string | undefined = undefined;
  public readonly prev: string | undefined = undefined;
  public readonly next: string | undefined = undefined;
  public readonly properties: ReadonlyProperties = new Properties();

  public static fromJSON(
    source: ICanvasNode,
    prev: string | undefined = undefined,
    next: string | undefined = undefined
  ): NodeModel {
    return new NodeModel({
      ...source,
      ports: source.ports?.map(PortModel.fromJSON),
      prev,
      next,
      portPositionCache: new Map(),
      properties: Properties.from(source.properties),
    });
  }

  public getPort(id: string): PortModel | undefined {
    return this.ports?.find((port) => port.id === id);
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
  public updatePositionAndSize(dummy: ICanvasNode): NodeModel {
    const { x, y, width, height } = dummy;
    return this.merge({
      x,
      y,
      width: width ?? this.width,
      height: height ?? this.height,
      portPositionCache: new Map(),
    });
  }

  public updatePorts(
    f: (
      port: PortModel,
      index: number,
      array: readonly PortModel[]
    ) => Partial<IPortModel>
  ): NodeModel {
    if (!this.ports) {
      return this;
    }
    const ports = mapCow(this.ports, (port, index, array) =>
      port.pipe((port) => f(port, index, array))
    );

    return this.ports === ports
      ? this
      : this.merge({
          ports,
        });
  }

  public invalidCache(): NodeModel {
    return this.merge({
      portPositionCache: new Map(),
    });
  }

  public toJSON(): ICanvasNode {
    return {
      shape: this.shape,
      x: this.x,
      y: this.y,
      name: this.name,
      id: this.id,
      status: this.status,
      height: this.height,
      width: this.width,
      automationId: this.automationId,
      ports: this.ports?.map((port) => port.toJSON()),
      ariaLabel: this.ariaLabel,
      properties: this.properties.toJSON(),
    };
  }

  public setProperties(properties: ReadonlyProperties): NodeModel {
    return this.merge({
      properties,
    });
  }
}
