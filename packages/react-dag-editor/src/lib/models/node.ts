import { IRecordApplicable } from "record-class";
import record from "record-class/macro";
import {
  Properties,
  ReadonlyProperties,
  WithPropertiesRecord,
} from "../property";
import type { $Complete } from "../utils/complete";
import { IEntity } from "./entity";
import type { IPoint } from "./geometry";
import type { PortModel } from "./port";
import type { GraphNodeStatus, IWithStatus } from "./status";
import type { $Model } from "./model";

export interface ICanvasNode extends IWithStatus<GraphNodeStatus>, IEntity {
  readonly x: number;
  readonly y: number;
  readonly name: string;
  readonly id: string;
  readonly height: number;
  readonly width: number;
  readonly shape?: string;
  readonly automationId?: string;
  readonly ports?: ReadonlyArray<PortModel>;
}

export interface INodeModel extends $Model<Omit<ICanvasNode, "ports">> {
  readonly ports?: ReadonlyArray<PortModel>;
  readonly portPositionCache: Map<string, IPoint>;
  readonly prev: string | undefined;
  readonly next: string | undefined;
}

export type INodeUpdate = (node: INodeModel) => Partial<INodeModel>;
export type INodeApplicable<T> = IRecordApplicable<NodeModel, T>;

@record
export class NodeModel
  extends WithPropertiesRecord<INodeModel, NodeModel>
  implements $Complete<INodeModel>
{
  public readonly x!: number;
  public readonly y!: number;
  public readonly name!: string;
  public readonly id!: string;
  public readonly height!: number;
  public readonly width!: number;
  public readonly shape: string | undefined = undefined;
  public readonly status: GraphNodeStatus | undefined = undefined;
  public readonly automationId: string | undefined = undefined;
  public readonly ports: ReadonlyArray<PortModel> | undefined = undefined;
  public readonly properties: Properties = new Properties();
  public readonly portPositionCache = new Map<string, IPoint>();
  public readonly prev: string | undefined = undefined;
  public readonly next: string | undefined = undefined;

  public static fromJSON(value: ICanvasNode | INodeModel): NodeModel {
    return new NodeModel({
      ...value,
      properties: Properties.from(value.properties),
    });
  }

  public setProperties(properties: ReadonlyProperties): NodeModel {
    return this.merge({
      properties,
    });
  }

  public getPort(id: string): PortModel | undefined {
    return this.ports?.find((port) => port.id === id);
  }

  public hasPort(id: string): boolean {
    return Boolean(this.ports?.find((port) => port.id === id));
  }

  public getPortPosition(portId: string): IPoint | undefined {
    let point: IPoint | undefined = this.portPositionCache.get(portId);
    if (!point) {
      const port = this.getPort(portId);
      if (!port) {
        return undefined;
      }
      const { width, height } = this;
      const xOffset = port.position ? port.position[0] * width : width * 0.5;
      const x = this.x + xOffset;
      const yOffset = port.position ? port.position[1] * height : height;
      const y = this.y + yOffset;
      point = {
        x,
        y,
      };
      this.portPositionCache.set(portId, point);
    }
    return point;
  }

  public invalidCache(): NodeModel {
    return this.merge({
      portPositionCache: new Map(),
    });
  }

  protected override $$create(partial: Partial<INodeModel>): NodeModel {
    return new NodeModel(partial);
  }
}
