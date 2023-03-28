import * as React from "react";
import { MenuType } from "../../../contexts";
import { useContextMenuConfigContext } from "../../../hooks";

export const CanvasMenu: React.FunctionComponent<React.PropsWithChildren> = (
  props
) => {
  const contextMenuConfig = useContextMenuConfigContext();
  contextMenuConfig.registerMenu(props.children, MenuType.Canvas);
  return null;
};
