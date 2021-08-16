import { createContext } from "react";
import { ILine } from "../components/Line";

export const AlignmentLinesContext = createContext<readonly ILine[]>([]);
