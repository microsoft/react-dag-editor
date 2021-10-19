import * as React from "react";
import { TGetPositionFromEvent } from "../../controllers";
import { IEvent } from "../../models/event";
import { ICanvasEdge } from "../../models/edge";
import { GraphModel } from "../../models/GraphModel";
import { ICanvasNode } from "../../models/node";
import { NodeModel } from "../../models/NodeModel";
import { ICanvasPort } from "../../models/port";
import { CanvasMouseMode } from "../../models/state";

export interface IGraphProps<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  /**
   * Title of the svg
   */
  title?: string;
  /**
   * Desc of the svg
   */
  desc?: string;
  /**
   * Custom styling for the graph container
   */
  style?: React.CSSProperties;
  classes?: IGraphClasses;
  /**
   * Custom styling for the elements in graph
   */
  styles?: IGraphStyles;
  /**
   * The mouse mode: select or pan
   */
  canvasMouseMode?: CanvasMouseMode;
  /**
   * The ref of the svg element
   */
  svgRef?: React.RefObject<SVGSVGElement>;
  /**
   * The access key to focus the canvas
   *
   * @default "f"
   * @
   */
  focusCanvasAccessKey?: string;
  /**
   * Zoom sensitivity
   *
   * @default 0.1
   */
  zoomSensitivity?: number;
  /**
   * Scroll/wheel sensitivity
   *
   * @default 0.5
   */
  scrollSensitivity?: number;
  /**
   * The threshold of drag/click
   *
   * @default 10
   */
  dragThreshold?: number;
  /**
   * The threshold of numbers of visible nodes to disable auto align
   *
   * @default 50
   */
  autoAlignThreshold?: number;
  /**
   * Custom overrides to get the client position
   *
   * @default "(e: MouseEvent) => ({ x: e.clientX, y: e.clientY })"
   */
  getPositionFromEvent?: TGetPositionFromEvent;
  /**
   * Delay time of virtualization calculation in ms
   *
   * @default 500
   */
  virtualizationDelay?: number;
  /**
   * Render function when browser not supported.
   */
  onBrowserNotSupported?(): React.ReactChild;

  /**
   * Triggered before add an edge
   */
  edgeWillAdd?(edge: ICanvasEdge<EdgeData>, data: GraphModel<NodeData, EdgeData, PortData>): ICanvasEdge;

  /**
   * Custom overrides the nodes aria-label
   */
  getNodeAriaLabel?(node: ICanvasNode<NodeData, PortData>): string | undefined;

  /**
   * Custom overrides the ports aria-label
   */
  getPortAriaLabel?(
    data: GraphModel<NodeData, EdgeData, PortData>,
    node: NodeModel<NodeData, PortData>,
    port: ICanvasPort<PortData>
  ): string | undefined;
  /**
   * The events handler function
   *
   * @param event
   */
  onEvent?(event: IEvent<NodeData, EdgeData, PortData>): void;
}

export interface IGraphClasses {
  root?: string;
  svg?: string;
}

export interface IGraphStyles {
  /**
   * custom the graph container style
   */
  root?: React.CSSProperties;
  /**
   * custom the graph svg style
   */
  svg?: React.CSSProperties;
  /**
   * custom the connecting line style
   */
  connectingLine?: React.CSSProperties;
  /**
   * custom the alignment line style
   */
  alignmentLine?: React.CSSProperties;
  /**
   * select box / select range style
   */
  selectBox?: React.CSSProperties;
}
