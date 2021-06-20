import { mergeStyleSets } from "@fluentui/merge-styles";
import * as React from "react";
import { IContextMenuProps } from "../../../contexts";
import { useContextMenuConfigContext, useTheme } from "../../../hooks";

export const ContextMenu: React.FunctionComponent<IContextMenuProps> = props => {
  const { theme } = useTheme();
  const classes = mergeStyleSets({
    contextMenu: {
      fontSize: 14,
      background: theme.contextMenuBackground,
      color: theme.fontColor,
      border: `1px solid ${theme.contextMenuBorder}`,
      width: 193,
      lineHeight: "20px",
      cursor: "default",
      "> *": {
        padding: 8,
        ":hover": {
          background: theme.contextMenuHoverBackground
        }
      }
    }
  });

  const propsMerged = {
    ...props,
    ...{ className: `${classes.contextMenu} ${props.className}` }
  };

  const contextMenuConfig = useContextMenuConfigContext();
  contextMenuConfig.registerContextMenu(propsMerged);

  return <div>{props.children}</div>;
};
