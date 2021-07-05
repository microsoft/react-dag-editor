import { createContext } from "react";
import { EMPTY_VIEW_PORT, IViewport } from "./GraphStateContext";

export const ViewportContext = createContext<IViewport>(EMPTY_VIEW_PORT);
