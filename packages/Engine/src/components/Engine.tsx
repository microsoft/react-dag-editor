import * as React from "react";
import { DefaultClipboard, defaultPort, DefaultStorage, line, rect } from "../built-in";
import {
  ContextMenuConfig,
  ContextMenuConfigContext,
  GraphConfig,
  GraphConfigContext,
  PropsAPIContext
} from "../contexts";
import { useConst } from "../hooks/useConst";
import { PropsAPI } from "../props-api/PropsAPI";
import { Debug } from "../utils/debug";
import { ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";
import { PanelContextProvider } from "./PanelContextProvider";
import { RegisterClipboard, RegisterEdge, RegisterNode, RegisterPort } from "./RegisterComponent";
import { IThemeProviderProps, ThemeProvider } from "./ThemeProvider";

/**
 * Engine props
 */
export interface IEngineProps extends IThemeProviderProps {
  /**
   * @default Window
   */
  globalEventTarget?: Window | Element;
  /**
   * Additional css styles to apply to the container element.
   */
  style?: React.CSSProperties;
  /**
   * Additional css class to apply to the container element.
   */
  className?: string;
  /**
   * Fired when there is invalid data or config. The invalid data or config will be ignored to avoid crashing your app.
   */
  handleWarning?(message: string): void;

  /**
   * Fired when Engine catches an error. And the return value will be rendered.
   */
  handleError?(error?: Error, errorInfo?: React.ErrorInfo, children?: React.ReactNode): React.ReactChild;
}

/**
 * Engine top level container component
 *
 * @param props
 */
export const Engine: React.FunctionComponent<IEngineProps> = props => {
  const clipboardStorage = useConst(() => new DefaultStorage());
  const clipboard = useConst(() => new DefaultClipboard(clipboardStorage));

  React.useEffect(() => {
    if (props.handleWarning) {
      Debug.warn = props.handleWarning;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = props.handleError?.bind(null);

  const { globalEventTarget = window, theme, setTheme } = props;

  return (
    <ErrorBoundary renderOnError={handleError}>
      <GraphConfigContext.Provider value={React.useMemo(() => new GraphConfig(globalEventTarget), [globalEventTarget])}>
        <ContextMenuConfigContext.Provider value={useConst(() => new ContextMenuConfig())}>
          <PropsAPIContext.Provider value={useConst(() => new PropsAPI())}>
            <ThemeProvider theme={theme} setTheme={setTheme}>
              <PanelContextProvider>
                <RegisterNode name="default" config={rect} />
                <RegisterEdge name="default" config={line} />
                <RegisterPort name="default" config={defaultPort} />
                <RegisterClipboard clipboard={clipboard} />
                <div style={props.style} className={props.className}>
                  {props.children}
                </div>
              </PanelContextProvider>
            </ThemeProvider>
          </PropsAPIContext.Provider>
        </ContextMenuConfigContext.Provider>
      </GraphConfigContext.Provider>
    </ErrorBoundary>
  );
};
