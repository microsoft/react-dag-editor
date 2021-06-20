import * as React from "react";
import { IGraphClipBoard } from "../../built-in/defaultClipboard";
import { GraphConfigContext } from "../../contexts";

export interface IRegisterClipboardProps {
  /**
   * The clipboard could be a class implements IGraphClipBoard.
   */
  clipboard: IGraphClipBoard;
}

/**
 * Register custom clipboard.
 * If not register, will use the default clipboard to copy/paste your data.
 *
 * @param props
 */
export const RegisterClipboard: React.FunctionComponent<IRegisterClipboardProps> = props => {
  const graphConfig = React.useContext(GraphConfigContext);

  React.useEffect(() => {
    graphConfig.registerClipboard(props.clipboard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
