import * as React from "react";
import { IPanelConfig, IPanelContext, IPanelState, PanelContext } from "../contexts";

export const PanelContextProvider: React.FunctionComponent = ({ children }) => {
  const [panelState, setPanelState] = React.useState<IPanelState>({});
  const panelContext = React.useMemo<IPanelContext>(
    () => ({
      configList: new Map<string, IPanelConfig>(),
      state: panelState,
      setState: setPanelState
    }),
    [panelState, setPanelState]
  );

  return <PanelContext.Provider value={panelContext}>{children}</PanelContext.Provider>;
};
