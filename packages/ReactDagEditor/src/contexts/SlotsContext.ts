import { createContext } from "react";

export interface INodeFrameProps {
  height: number;
  width: number;
}

export interface ISlotsContext {
  renderNodeFrame?(props: INodeFrameProps): JSX.Element;
}

export const SlotsContext = createContext<ISlotsContext>({});
