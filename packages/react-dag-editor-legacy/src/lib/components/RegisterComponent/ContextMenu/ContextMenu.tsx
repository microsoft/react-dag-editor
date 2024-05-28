import { mergeStyleSets } from "@fluentui/merge-styles";
import * as React from "react";
import { defaultColors } from "../../../common/constants";
import { IContextMenuProps } from "../../../contexts";
import { useContextMenuConfigContext } from "../../../hooks";

export const ContextMenu: React.FunctionComponent<
  React.PropsWithChildren<IContextMenuProps>
> = (props) => {
  const classes = mergeStyleSets({
    contextMenu: {
      fontSize: 14,
      background: defaultColors.contextMenuBackground,
      color: defaultColors.fontColor,
      border: `1px solid ${defaultColors.contextMenuBorder}`,
      width: 193,
      lineHeight: "20px",
      cursor: "default",
      "> *": {
        padding: 8,
        ":hover": {
          background: defaultColors.contextMenuHoverBackground,
        },
      },
    },
  });

  const propsMerged = {
    ...props,
    ...{ className: `${classes.contextMenu} ${props.className}` },
  };

  const contextMenuConfig = useContextMenuConfigContext();
  contextMenuConfig.registerContextMenu(propsMerged);

  return <div>{props.children}</div>;
};
