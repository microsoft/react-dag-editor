import * as React from "react";
import { GraphConfigContext, IPortConfig } from "../../contexts";

export interface IRegisterPortProps {
  /**
   * Name of the custom port. The "shape" in your port model should have been registered as the name here.
   */
  name: string;
  /**
   * The config could be a class that implements IPortConfig
   */
  config: IPortConfig;
}

/**
 * Register custom port. Specify the "shape" in your port model(ref interface ICanvasEdge) to use your custom port.
 * If not register, will use the default port config.
 *
 * @param props
 */
export const RegisterPort: React.FunctionComponent<IRegisterPortProps> = props => {
  const graphConfig = React.useContext(GraphConfigContext);

  graphConfig.registerPort(props.name, props.config);

  return null;
};
