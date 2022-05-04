import { lift } from "record-class";
import { INodeUpdate } from "./models/node";
import { IPortUpdate } from "./models/port";

export const liftPorts =
  (f: IPortUpdate): INodeUpdate =>
  (node) => {
    return {
      ports: node.ports?.map(lift(f)),
    };
  };

export interface INodeGeometryChange {
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
}

export const updateNodeGeometry =
  (change: INodeGeometryChange): INodeUpdate =>
  (node) => {
    return {
      x: (change.dx | 0) + node.x,
      y: (change.dy | 0) + node.y,
      width: (change.dWidth | 0) + node.width,
      height: (change.dHeight | 0) + node.height,
      portPositionCache: new Map(),
    };
  };

export const updatePort =
  (portId: string, f: IPortUpdate): INodeUpdate =>
  (node) => {
    if (!node.ports) {
      return {};
    }
    const index = node.ports?.findIndex((port) => port.id === portId);
    if (!index) {
      return {};
    }
    const ports = node.ports.slice();
    ports[index] = ports[index].pipe(f);
    return {
      ports,
    };
  };
