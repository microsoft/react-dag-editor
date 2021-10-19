import type { IGraphConfig, INodeConfig } from "../models/config/types";
import type { ICanvasNode } from "../models/node";
import { Debug } from "./debug";

export const getNodeConfig = (node: ICanvasNode, graphConfig: IGraphConfig): INodeConfig | undefined => {
  const nodeConfig = graphConfig.getNodeConfigByName(node.shape);

  if (!nodeConfig) {
    Debug.warn(`invalid shape in node ${JSON.stringify(node)}`);

    return undefined;
  }

  return nodeConfig;
};
