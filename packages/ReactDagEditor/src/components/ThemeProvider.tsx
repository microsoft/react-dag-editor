import * as React from "react";
import { ITheme, ThemeContext } from "../contexts/ThemeContext";
import { noop } from "../utils/noop";

const defaultTheme = {
  controlPointColor: "#333333",
  primaryColor: "#0078D4",
  defaultColor: "#CCCCCC",
  borderColor: "#B3B0AD",
  defaultBorderColor: "#FFFFFF",
  unConnectableBgColor: "#E1DFDD",
  defaultBackgroundColor: "#FFFFFF",
  portStroke: "#ccc",
  portFill: "#fff",
  connectedPortColor: "gray",
  nodeActivateFill: "#ffffff",
  nodeActivateStroke: "#0078D4",
  nodeFill: "#ffffff",
  nodeStroke: "#cccccc",
  contextMenuBackground: "#FFFFFF",
  contextMenuBorder: "#E1DFDD",
  contextMenuHoverBackground: "rgba(0, 120, 212, 0.05)",
  fontColor: "#000000",
  canvasBackground: "#EDEDED",
  minimapBackground: "#EDEDED",
  edgeColor: "#ccc",
  edgeColorSelected: "#015cda",
  minimapShadow: "#000000",
  outlineStyle: "none",
  focusOutlineColor: "#000000",
  dummyNodeStroke: "#015cda",
  inputFocusBorderAlt: "#0078d4",
  buttonBorder: "#797775",
  scrollbarColor: "#c8c8c8"
};

export interface IThemeProviderProps {
  theme?: ITheme;
  setTheme?: React.Dispatch<React.SetStateAction<ITheme>>;
}

export const ThemeProvider: React.FunctionComponent<IThemeProviderProps> = ({ theme, setTheme = noop, children }) => {
  const themeContext = React.useMemo(
    () => ({
      theme: { ...defaultTheme, ...theme },
      setTheme
    }),
    [setTheme, theme]
  );

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>;
};
