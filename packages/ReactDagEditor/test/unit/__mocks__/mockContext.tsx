import * as React from "react";
import { IGraphConfig } from "../../../src";
import { defaultGraphConfigContext, GraphConfigContext } from "../../../src/contexts/GraphConfigContext";

export const withGraphConfigContext = (comp: React.ReactElement, _defaultContext?: Partial<IGraphConfig>) => {
  const graphConfigContext: IGraphConfig = {
    ...defaultGraphConfigContext,
    ..._defaultContext
  };
  return <GraphConfigContext.Provider value={graphConfigContext}>{comp}</GraphConfigContext.Provider>;
};
