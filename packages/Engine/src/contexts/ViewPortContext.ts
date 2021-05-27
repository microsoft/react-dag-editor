import { createContext } from "react";
import { EMPTY_VIEW_PORT, IViewPort } from "./GraphStateContext";

export const ViewPortContext = createContext<IViewPort>(EMPTY_VIEW_PORT);
