import { createContext } from "react";
import { IViewport } from "../models/geometry";
import { EMPTY_VIEW_PORT} from "./GraphStateContext";

export const ViewportContext = createContext<IViewport>(EMPTY_VIEW_PORT);
