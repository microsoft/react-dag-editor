import * as React from "react";
import { INodeGeometryDelta } from "../../models/GraphModel";
import { NodeModel } from "../../models/NodeModel";

export type Handler = (dx: number, dy: number) => Partial<INodeGeometryDelta>;
export type GetMouseDown = (f: Handler) => (evt: React.MouseEvent) => void;

export interface IGraphNodeAnchorsProps {
  node: NodeModel;
  getMouseDown: GetMouseDown;
}

export type RenderNodeAnchors<NodeData = unknown, PortData = unknown> = (
  node: NodeModel<NodeData, PortData>,
  getMouseDown: GetMouseDown,
  defaultAnchors: JSX.Element
) => JSX.Element;
