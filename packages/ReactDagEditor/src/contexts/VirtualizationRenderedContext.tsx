import { createContext } from "react";

export interface IRenderedContext {
  nodes: Set<string>;
  edges: Set<string>;
}

export const VirtualizationRenderedContext = createContext<IRenderedContext>({
  nodes: new Set<string>(),
  edges: new Set<string>()
});
