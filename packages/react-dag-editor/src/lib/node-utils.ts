import { INodeUpdate, IPortUpdate } from "react-dag-editor";
import { lift } from "record-class";

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
