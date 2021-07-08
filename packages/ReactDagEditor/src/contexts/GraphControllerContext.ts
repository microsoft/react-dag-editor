import { createContext } from "react";
import { GraphController } from "../utils/graphController";
import { noop } from "../utils/noop";
import { EMPTY_GRAPH_STATE } from "./GraphStateContext";

export const GraphControllerContext = createContext(new GraphController(EMPTY_GRAPH_STATE, noop));
