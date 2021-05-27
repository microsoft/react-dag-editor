import {
  emptyNodeConfig,
  IGraphConfig,
  IRectConfig
} from "../contexts/GraphConfigContext";
import { ICanvasNode } from "../Graph.interface";
import { Debug } from "./debug";

export const getNodeConfig = (
  node: ICanvasNode,
  graphConfig: IGraphConfig
): IRectConfig<ICanvasNode> => {
  const nodeConfig = graphConfig.getNodeConfigByName(node.shape);

  if (!nodeConfig) {
    Debug.warn(`invalid shape in node ${JSON.stringify(node)}`);

    return emptyNodeConfig;
  }

  return nodeConfig;
};
