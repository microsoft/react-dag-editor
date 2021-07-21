import { ICanvasData } from "../models/canvas";

export interface IGraphClipboard<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  write(data: ICanvasData<NodeData, EdgeData, PortData>): void;
  read(): ICanvasData<NodeData, EdgeData, PortData> | null;
}
