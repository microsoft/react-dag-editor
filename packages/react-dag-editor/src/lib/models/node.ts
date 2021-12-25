import { Properties, ReadonlyProperties, WithPropertiesRecord } from "core";
import type { $Complete } from "../utils/complete";
import type { IPoint } from "./geometry";
import type { PortModel } from "./port";
import type { GraphNodeStatus } from "./status";
import type { $Model } from "./model";

export interface ICanvasNode {
  readonly x: number;
  readonly y: number;
  readonly name: string;
  readonly id: string;
  readonly height: number;
  readonly width: number;
  readonly shape?: string;
  readonly status?: GraphNodeStatus;
  readonly automationId?: string;
  readonly ports?: ReadonlyArray<PortModel>;
}

export interface INodeModel extends Omit<$Model<ICanvasNode>, "ports"> {
  readonly ports?: ReadonlyArray<PortModel>;
  readonly portPositionCache: Map<string, IPoint>;
}

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

  public $$create(partial: Partial<INodeModel>): NodeModel {
    return new NodeModel(partial);
  }

  public setProperties(properties: ReadonlyProperties): NodeModel {
    return this.merge({
      properties,
    });
  }

  public getPort(id: string): PortModel | undefined {
    return this.ports?.find((port) => port.id === id);
  }
}
