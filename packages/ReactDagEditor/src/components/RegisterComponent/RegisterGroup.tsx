import * as React from "react";
import { GraphConfigContext, IGroupConfig } from "../../contexts";

export interface IRegisterGroupProps {
  /**
   * Name of the custom group. The "shape" in your group model should have been registered as the name here.
   */
  name: string;
  /**
   * The config could be a class that implements IGroupConfig
   */
  config: IGroupConfig;
}

/**
 * Register custom group (the Group is a group of nodes). Specify the "shape" in your group model(ref interface ICanvasGroup) to use your custom group.
 * If not register, will use the default group config.
 *
 * @param props
 */
export const RegisterGroup: React.FunctionComponent<IRegisterGroupProps> = props => {
  const graphConfig = React.useContext(GraphConfigContext);

  graphConfig.registerGroup(props.name, props.config);

  return null;
};
