import * as React from "react";

export interface ITheme {
  [key: string]: string;
}

export interface IThemeContext {
  theme: ITheme;
  setTheme: React.Dispatch<React.SetStateAction<ITheme>>;
}

export const ThemeContext = React.createContext<IThemeContext>({
  theme: {},
  setTheme: () => {
    // default setTheme
  }
});
