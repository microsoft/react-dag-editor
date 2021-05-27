import * as React from "react";
import { IPanelConfig, PanelContext } from "../../contexts";

export interface IRegisterPanelProps {
  /**
   * Name of the custom panel. The name of each type of panel should be uniq
   */
  name: string;
  /**
   * The config could be a class that implements IPanelConfig
   */
  config: IPanelConfig;
}

/**
 * Register custom panel
 *
 * @param props
 */
export const RegisterPanel: React.FunctionComponent<IRegisterPanelProps> = props => {
  const panelContext = React.useContext(PanelContext);

  panelContext.configList.set(props.name, props.config);

  return null;
};
