import * as React from "react";
import { MenuType } from "../../../contexts";
import { useContextMenuConfigContext } from "../../../hooks";

export const NodeMenu: React.FunctionComponent = (props) => {
  const contextMenuConfig = useContextMenuConfigContext();
  contextMenuConfig.registerMenu(props.children, MenuType.Node);
  return null;
};
