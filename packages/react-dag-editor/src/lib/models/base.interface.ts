import type {
  GraphEdgeStatus,
  GraphNodeStatus,
  GraphPortStatus,
} from "./status";

export const PropertiesKey = Symbol("Properties");

export enum PortIOType {
  Input = "input",
  Output = "output",
}

/**
 * @tsRecord
 * @tsRecordImplementation {import("./properties").Properties}}
 */
export interface IEntity {
  /**
   * @tsRecordToJSON getAllProperties
   */
  [PropertiesKey]?: Readonly<Record<symbol, unknown>>;
}

export interface IPortInit extends IEntity {
  readonly id: string;
  readonly name: string;
  readonly shape?: string;
  readonly status?: GraphPortStatus;
  readonly ioType: PortIOType;
  readonly automationId?: string;
}

/**
 * @tsRecord
 */
export interface IPort extends IPortInit {
  readonly position: readonly [number, number];
}

/**
 * @tsRecord
 */
export interface INode extends IEntity {
  readonly shape?: string;
  readonly x: number;
  readonly y: number;
  readonly name?: string;
  readonly id: string;
  readonly status?: GraphNodeStatus;
  readonly height?: number;
  readonly width?: number;
  readonly automationId?: string;
  readonly ports?: ReadonlyArray<IPort>;
}

/**
 * @tsRecord
 */
export interface IEdge extends IEntity {
  readonly shape?: string;
  /**
   * source node id
   */
  readonly source: string;
  /**
   * target node id
   */
  readonly target: string;
  readonly sourcePortId: string;
  readonly targetPortId: string;
  readonly id: string;
  readonly status?: GraphEdgeStatus;
  readonly automationId?: string;
}
