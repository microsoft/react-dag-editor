import * as React from "react";

export interface IPanelConfig {
  render(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    containerRef: React.RefObject<SVGSVGElement>
  ): React.ReactNode;
  panelDidOpen?(): void;
  panelDidDismiss?(): void;
}

export interface IPanelState {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface IPanelContext {
  configList: Map<string, IPanelConfig>;
  state: IPanelState;
  setState(state: IPanelState): void;
}

export const PanelContext = React.createContext<IPanelContext>({
  setState: () => {
    // do nothing
  },
  state: {
    name: undefined
  },
  configList: new Map<string, IPanelConfig>()
});
