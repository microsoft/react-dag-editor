import * as React from "react";
import { MenuType } from "../../../contexts";
import { useContextMenuConfigContext } from "../../../hooks";

export const PortMenu: React.FunctionComponent = props => {
  const contextMenuConfig = useContextMenuConfigContext();
  contextMenuConfig.registerMenu(props.children, MenuType.Port);
  return null;
};
