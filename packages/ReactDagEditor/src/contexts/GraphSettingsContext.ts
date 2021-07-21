import { createContext } from "react";
import { defaultFeatures } from "../Features";
import { IGraphSettings } from "../models/state";
import { GraphConfigBuilder } from "../settings/GraphConfigBuilder";
import { DEFAULT_NODE_MAX_VISIBLE_SIZE, DEFAULT_NODE_MIN_VISIBLE_SIZE, EMPTY_GAP } from "./GraphStateContext";

export const EMPTY_SETTINGS: IGraphSettings = {
  features: defaultFeatures,
  graphConfig: GraphConfigBuilder.default().build(),
  canvasBoundaryPadding: EMPTY_GAP,
  nodeMinVisibleSize: DEFAULT_NODE_MIN_VISIBLE_SIZE,
  nodeMaxVisibleSize: DEFAULT_NODE_MAX_VISIBLE_SIZE
};

export const GraphSettingsContext = createContext<IGraphSettings>(EMPTY_SETTINGS);
