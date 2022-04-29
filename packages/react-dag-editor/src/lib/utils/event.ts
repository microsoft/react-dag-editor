import {
  ICanvasEvent,
  IEdgeEvent,
  IEvent,
  INodeEvent,
  IPortEvent,
} from "../models/event";

export function isEdgeEvent(event: IEvent): event is IEdgeEvent {
  return event.type.startsWith("[Edge]");
}

export function isNodeEvent(event: IEvent): event is INodeEvent {
  return event.type.startsWith("[Node]");
}

export function isPortEvent(event: IEvent): event is IPortEvent {
  return event.type.startsWith("[Port]");
}

export function isCanvasEvent(event: IEvent): event is ICanvasEvent {
  return event.type.startsWith("[Canvas]");
}
