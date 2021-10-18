import * as React from "react";
import { GraphConfigBuilder, IGraphConfig } from "../../../index";
import { GraphConfigContext } from "../../../src/contexts/GraphConfigContext";

export const defaultConfig = GraphConfigBuilder.default().build();

export const withGraphConfigContext = (comp: React.ReactElement, config?: IGraphConfig) => {
  return <GraphConfigContext.Provider value={config ?? defaultConfig}>{comp}</GraphConfigContext.Provider>;
};
