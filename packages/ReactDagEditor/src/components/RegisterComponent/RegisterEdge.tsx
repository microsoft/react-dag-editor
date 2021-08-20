import * as React from "react";
import { IEdgeConfig } from "../../contexts";
import { useGraphConfig } from "../../hooks/context";

export interface IRegisterEdgeProps {
  /**
   * Name of the custom edge. The "shape" in your edge model should have been registered as the name here.
   */
  name: string;
  /**
   * The config could be a class that implements IEdgeConfig
   */
  config: IEdgeConfig;
}

/**
 * Register custom edge. Specify the "shape" in your edge model(ref interface ICanvasEdge) to use your custom edge.
 * If not register, will use the default edge config.
 *
 * @param props
 */
export const RegisterEdge: React.FunctionComponent<IRegisterEdgeProps> = props => {
  const graphConfig = useGraphConfig();

  graphConfig.registerEdge(props.name, props.config);

  return null;
};
