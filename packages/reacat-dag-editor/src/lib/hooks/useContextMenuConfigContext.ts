import * as React from "react";
import { ContextMenuConfigContext, IContextMenuConfig } from "../contexts";

export const useContextMenuConfigContext = (): IContextMenuConfig => {
  return React.useContext<IContextMenuConfig>(ContextMenuConfigContext);
};
