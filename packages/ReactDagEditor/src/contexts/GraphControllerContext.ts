import { createContext } from "react";
import { GraphController } from "../controllers/GraphController";
import { EMPTY_GRAPH_STATE } from "../createGraphState";
import { noop } from "../utils/noop";

export const GraphControllerContext = createContext(new GraphController(EMPTY_GRAPH_STATE, noop));
