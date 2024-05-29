import type { IGraphConfig, INodeConfig } from "../models/config/types";
import type { IPoint } from "../models/geometry";
import type { ICanvasNode } from "../models/node";
import type { ICanvasPort } from "../models/port";
import { Debug } from "./debug";
import { getNodeConfig } from "./getNodeConfig";
import { getRectHeight, getRectWidth } from "./layout";

export const getPortPosition = (node: ICanvasNode, port: ICanvasPort, nodeConfig: INodeConfig): IPoint => {
  const width = getRectWidth(nodeConfig, node);
  const height = getRectHeight(nodeConfig, node);

  const xOffset = port.position ? port.position[0] * width : width * 0.5;
  const x = node.x + xOffset;
  const yOffset = port.position ? port.position[1] * height : height;
  const y = node.y + yOffset;

  return {
    x,
    y,
  };
};

export const getPortPositionByPortId = (
  node: ICanvasNode,
  portId: string,
  graphConfig: IGraphConfig,
): IPoint | undefined => {
  const nodeConfig = getNodeConfig(node, graphConfig);

  if (!nodeConfig) {
    return undefined;
  }

  const ports = node.ports || [];

  const port = ports.find(p => p.id === portId);

  if (!port) {
    Debug.warn(`invalid port id ${JSON.stringify(port)}`);

    return undefined;
  }

  return getPortPosition(node, port, nodeConfig);
};
