import { createContext } from "react";
import { GraphConfigBuilder } from "../models/config/GraphConfigBuilder";
import { IGraphConfig } from "../models/config/types";

export const GraphConfigContext = createContext<IGraphConfig>(GraphConfigBuilder.default().build());
