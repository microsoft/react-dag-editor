import { OrderedMap } from "../collections";

import { ICanvasGroup } from "../models/canvas";
import { ICanvasNode } from "../models/node";
import { NodeModel } from "../models/NodeModel";
import { INodeConfig } from "../models/settings";
import { IGraphConfig } from "../settings/IGraphConfig";
import { getNodeConfig } from "./getNodeConfig";

/**
 * @param rectConfig
 * @param rect
 */
export function getRectWidth<T extends { width?: number }>(rectConfig: INodeConfig<T>, rect: T): number {
  const minWidth = rectConfig.getMinWidth(rect);

  if (rect.width && rect.width >= minWidth) {
    return rect.width;
  }

  return minWidth;
}

/**
 * @param rectConfig
 * @param rect
 */
export function getRectHeight<T extends { height?: number }>(rectConfig: INodeConfig<T>, rect: T): number {
  const minHeight = rectConfig.getMinHeight(rect);

  if (rect.height && rect.height >= minHeight) {
    return rect.height;
  }

  return minHeight;
}

export interface INodeRect {
  height: number;
  width: number;
}

/**
 * get node height and width by graphConfig
 *
 * @param node the node to get the size
 * @param graphConfig type IGraphConfig
 */
export function getNodeSize(node: ICanvasNode, graphConfig: IGraphConfig): INodeRect {
  const nodeConfig = getNodeConfig(node, graphConfig);
  const width = getRectWidth<ICanvasNode>(nodeConfig, node);
  const height = getRectHeight<ICanvasNode>(nodeConfig, node);

  return {
    height,
    width
  };
}

export interface IShapePosition {
  x: number;
  y: number;
}

export interface IShapeRect extends INodeRect, IShapePosition {}

/**
 * @param group
 * @param nodes
 * @param graphConfig
 */
export function getGroupRect<NodeData, PortData>(
  group: ICanvasGroup,
  nodes: OrderedMap<string, NodeModel<NodeData, PortData>>,
  graphConfig: IGraphConfig
): IShapeRect {
  const childrenIds = new Set(group.nodeIds);
  const children = Array.from(nodes.values()).filter(node => childrenIds.has(node.id));
  const minX = Math.min(...children.map(node => node.x));
  const maxX = Math.max(...children.map(node => node.x + getNodeSize(node, graphConfig).width));
  const minY = Math.min(...children.map(node => node.y));
  const maxY = Math.max(...children.map(node => node.y + getNodeSize(node, graphConfig).height));

  const x = minX - (group.padding?.left ?? 0);
  const y = minY - (group.padding?.top ?? 0);
  const height = maxY - y + (group.padding?.bottom ?? 0);
  const width = maxX - x + (group.padding?.left ?? 0);

  return {
    x,
    y,
    width,
    height
  };
}
