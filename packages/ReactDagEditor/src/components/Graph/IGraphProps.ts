import * as React from "react";
import { TGetPositionFromEvent } from "../../controllers";
import { GraphFeatures } from "../../Features";
import { IEvent } from "../../models/event";
import { ICanvasEdge } from "../../models/edge";
import { IGap } from "../../models/geometry";
import { GraphModel } from "../../models/GraphModel";
import { ICanvasNode } from "../../models/node";
import { NodeModel } from "../../models/NodeModel";
import { ICanvasPort } from "../../models/port";
import { CanvasMouseMode } from "../../models/state";
import { IPropsAPI } from "../../props-api/IPropsAPI";

export interface IGraphProps<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  /**
   * The propsAPI reference
   */
  propsAPIRef?: React.Ref<IPropsAPI<NodeData, EdgeData, PortData> | null>;
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
   * The default shape of the node
   *
   * @default "default"
   */
  defaultNodeShape?: string;
  /**
   * The default shape of the edge
   *
   * @default "default"
   */
  defaultEdgeShape?: string;
  /**
   * The default shape of the port
   *
   * @default "default"
   */
  defaultPortShape?: string;
  /**
   * The default shape of the group
   *
   * @default "default"
   */
  defaultGroupShape?: string;
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
   * Enabled features.
   */
  features?: Set<GraphFeatures>;
  /**
   * Port circle radius.
   */
  portRadius?: number;
  /**
   * The padding between the boundary of the canvas and the graph when scrolling/panning
   */
  canvasBoundaryPadding?: IGap;
  /**
   * Padding of graph.
   */
  padding?: IGap;
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
