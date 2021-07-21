import { IPoint } from "../models/geometry";
import { ICanvasNode } from "../models/node";
import { ICanvasPort } from "../models/port";
import { INodeConfig } from "../models/settings";
import { IGraphConfig } from "../settings/IGraphConfig";
import { Debug } from "./debug";
import { getNodeConfig } from "./getNodeConfig";
import { getRectHeight, getRectWidth } from "./layout";

export const getPortPosition = (node: ICanvasNode, port: ICanvasPort, nodeConfig: INodeConfig<ICanvasNode>): IPoint => {
  const width = getRectWidth<ICanvasNode>(nodeConfig, node);
  const height = getRectHeight<ICanvasNode>(nodeConfig, node);

  const xOffset = port.position ? port.position[0] * width : width * 0.5;
  const x = node.x + xOffset;
  const yOffset = port.position ? port.position[1] * height : height;
  const y = node.y + yOffset;

  return {
    x,
    y
  };
};

export const getPortPositionByPortId = (
  node: ICanvasNode,
  portId: string,
  graphConfig: IGraphConfig
): IPoint | undefined => {
  const nodeConfig = getNodeConfig(node, graphConfig);

  const ports = node.ports || [];

  const port = ports.find(p => p.id === portId);

  if (!port) {
    Debug.warn(`invalid port id ${JSON.stringify(port)}`);

    return undefined;
  }

  return getPortPosition(node, port, nodeConfig);
};
