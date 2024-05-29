import { ICanvasEvent, IEdgeEvent, IEvent, INodeEvent, IPortEvent } from "../models/event";

export function isEdgeEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown>(
  event: IEvent<NodeData, EdgeData, PortData>,
): event is IEdgeEvent<EdgeData> {
  return event.type.startsWith("onEdge");
}

export function isNodeEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown>(
  event: IEvent<NodeData, EdgeData, PortData>,
): event is INodeEvent<NodeData, PortData> {
  return event.type.startsWith("onNode");
}

export function isPortEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown>(
  event: IEvent<NodeData, EdgeData, PortData>,
): event is IPortEvent<NodeData, PortData> {
  return event.type.startsWith("onPort");
}

export function isCanvasEvent<NodeData = unknown, EdgeData = unknown, PortData = unknown>(
  event: IEvent<NodeData, EdgeData, PortData>,
): event is ICanvasEvent<NodeData, EdgeData, PortData> {
  return event.type.startsWith("onCanvas");
}
