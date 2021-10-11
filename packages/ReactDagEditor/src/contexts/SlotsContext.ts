import { createContext, MouseEventHandler } from "react";

export interface INodeFrameProps {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface INodeResizeHandlerProps {
  cursor: string;
  x: number;
  y: number;
  onMouseDown: MouseEventHandler;
}

export interface ISlotsContext {
  renderNodeFrame?(props: INodeFrameProps): JSX.Element;
  renderNodeResizeHandler?(props: INodeResizeHandlerProps): JSX.Element;
}

export const SlotsContext = createContext<ISlotsContext>({});
