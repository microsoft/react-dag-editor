import { createContext } from "react";
import { EMPTY_VIEW_PORT } from "../createGraphState";
import { IViewport } from "../models/geometry";

export const ViewportContext = createContext<IViewport>(EMPTY_VIEW_PORT);
