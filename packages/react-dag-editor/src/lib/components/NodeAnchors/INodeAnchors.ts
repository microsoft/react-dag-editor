import * as React from "react";
import { INodeGeometryDelta } from "../../models/GraphModel";
import { NodeModel } from "../../models/NodeModel";
import { EventChannel } from "../../utils/eventChannel";

export interface IGraphNodeAnchorsProps {
  node: NodeModel;
  eventChannel: EventChannel;
}

export type Handler = (dx: number, dy: number) => Partial<INodeGeometryDelta>;
export type GetMouseDown = (f: Handler) => (evt: React.MouseEvent) => void;
export type RenderNodeAnchors<NodeData = unknown, PortData = unknown> = (
  node: NodeModel<NodeData, PortData>,
  getMouseDown: GetMouseDown,
  defaultAnchors: JSX.Element
) => JSX.Element;
