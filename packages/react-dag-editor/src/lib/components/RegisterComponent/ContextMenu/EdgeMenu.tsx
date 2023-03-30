import * as React from "react";
import { MenuType } from "../../../contexts";
import { useContextMenuConfigContext } from "../../../hooks";

export const EdgeMenu: React.FunctionComponent<
  React.PropsWithChildren<object>
> = (props) => {
  const contextMenuConfig = useContextMenuConfigContext();
  contextMenuConfig.registerMenu(props.children, MenuType.Edge);
  return null;
};
