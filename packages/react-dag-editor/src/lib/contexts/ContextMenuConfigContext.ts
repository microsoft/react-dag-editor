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
  Multi = "multi",
}

export interface IContextMenuConfig {
  registerContextMenu(props: IContextMenuProps): void;
  registerMenu(element: React.ReactNode, menuType: MenuType): void;
  getMenu(menuType: MenuType): React.ReactNode;
}

export class ContextMenuConfig implements IContextMenuConfig {
  private readonly contextMenu = new Map<string, React.ReactNode>();
  private contextMenuProps: IContextMenuProps | undefined;

  public registerContextMenu(props: IContextMenuProps): void {
    this.contextMenuProps = { ...props };
  }

  public registerMenu(element: React.ReactNode, menuType: MenuType): void {
    this.contextMenu.set(menuType, element);
  }

  public getMenu(menuType: MenuType): React.ReactNode {
    if (this.contextMenuProps && this.contextMenu.has(menuType)) {
      const { className, styles } = this.contextMenuProps;
      const reactElement = React.createElement(
        "div",
        {
          className,
          style: styles,
        },
        this.contextMenu.get(menuType),
      );
      return reactElement;
    }
    return null;
  }
}

export const ContextMenuConfigContext = React.createContext<IContextMenuConfig>(new ContextMenuConfig());
