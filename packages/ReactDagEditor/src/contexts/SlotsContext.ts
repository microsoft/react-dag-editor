import { createContext } from "react";

export interface INodeFrameProps {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface ISlotsContext {
  renderNodeFrame?(props: INodeFrameProps): JSX.Element;
}

export const SlotsContext = createContext<ISlotsContext>({});
