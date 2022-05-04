import type { IGraphConfig, INodeConfig } from "../models/config/types";
import type { ICanvasNode, INodeModel } from "../models/node";
import { Debug } from "./debug";

export const getNodeConfig = (
  node: ICanvasNode | INodeModel,
  graphConfig: IGraphConfig
): INodeConfig | undefined => {
  const nodeConfig = graphConfig.getNodeConfigByName(node.shape);

  if (!nodeConfig) {
    Debug.warn(`invalid shape in node ${JSON.stringify(node)}`);

    return undefined;
  }

  return nodeConfig;
};
