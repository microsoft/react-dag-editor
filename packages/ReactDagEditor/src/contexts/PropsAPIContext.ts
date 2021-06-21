import { createContext } from "react";
import { PropsAPI } from "../props-api/PropsAPI";

export const PropsAPIContext = createContext<
  PropsAPI<unknown, unknown, unknown>
>(new PropsAPI());
