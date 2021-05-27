import * as React from "react";
import { IThemeContext, ThemeContext } from "../contexts/ThemeContext";

export const useTheme = (): IThemeContext => {
  return React.useContext<IThemeContext>(ThemeContext);
};
