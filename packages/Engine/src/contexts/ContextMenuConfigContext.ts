import * as React from "react";

export interface IContextMenuProps {
  className?: string;
  styles?: React.CSSProperties;
}

export enum MenuType {
  Node = "node",
  Edge = "edge",
  Port = "port",
  Canvas = "canvas",
  Multi = "multi"
}

export interface IContextMenuConfig {
  registerContextMenu(props: IContextMenuProps): void;
  registerMenu(element: React.ReactNode, menuType: MenuType): void;
  getMenu(menuType: MenuType): React.ReactNode;
}

export class ContextMenuConfig implements IContextMenuConfig {
  private readonly contextMenu = {};
  private contextMenuProps: IContextMenuProps;

  public registerContextMenu(props: IContextMenuProps): void {
    this.contextMenuProps = { ...props };
  }

  public registerMenu(element: React.ReactNode, menuType: MenuType): void {
    this.contextMenu[menuType] = element;
  }
  public getMenu(menuType: MenuType): React.ReactNode {
    if (this.contextMenuProps && this.contextMenu[menuType]) {
      const { className, styles } = this.contextMenuProps;
      const reactElement = React.createElement(
        "div",
        {
          className,
          style: styles
        },
        this.contextMenu[menuType]
      );
      return reactElement;
    }
    return null;
  }
}

export const ContextMenuConfigContext = React.createContext<IContextMenuConfig>(
  new ContextMenuConfig()
);
