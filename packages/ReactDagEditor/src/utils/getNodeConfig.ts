import { ICanvasNode } from "../models/node";
import { INodeConfig } from "../models/settings";
import { IGraphConfig } from "../settings/IGraphConfig";
import { Debug } from "./debug";

export const getNodeConfig = (node: ICanvasNode, graphConfig: IGraphConfig): INodeConfig | undefined => {
  const nodeConfig = graphConfig.getNodeConfigByName(node.shape);

  if (!nodeConfig) {
    Debug.warn(`invalid shape in node ${JSON.stringify(node)}`);

    return undefined;
  }

  return nodeConfig;
};
