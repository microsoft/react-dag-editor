import * as React from "react";
import { ContextMenuConfig, ContextMenuConfigContext, GraphConfigContext } from "../contexts";
import { useConst } from "../hooks/useConst";
import { GraphConfigBuilder } from "../models/config/GraphConfigBuilder";
import { Debug } from "../utils/debug";
import { ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";
import { IThemeProviderProps, ThemeProvider } from "./ThemeProvider";

/**
 * ReactDagEditor props
 */
export interface IReactDagEditorProps extends IThemeProviderProps {
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
   * Fired when ReactDagEditor catches an error. And the return value will be rendered.
   */
  handleError?(error?: Error, errorInfo?: React.ErrorInfo, children?: React.ReactNode): React.ReactChild;

  /**
   * Fallback to `window` if this is not provided or returns null or undefined
   */
  getGlobalEventTarget?(): Window | Element | null | undefined;
}

/**
 * ReactDagEditor top level container component
 *
 * @param props
 */
export const ReactDagEditor: React.FunctionComponent<IReactDagEditorProps> = props => {
  React.useEffect(() => {
    if (props.handleWarning) {
      Debug.warn = props.handleWarning;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = props.handleError?.bind(null);

  const { theme, setTheme } = props;

  return (
    <ErrorBoundary renderOnError={handleError}>
      <GraphConfigContext.Provider value={React.useMemo(() => GraphConfigBuilder.default().build(), [])}>
        <ContextMenuConfigContext.Provider value={useConst(() => new ContextMenuConfig())}>
          <ThemeProvider theme={theme} setTheme={setTheme}>
            <div style={props.style} className={props.className}>
              {props.children}
            </div>
          </ThemeProvider>
        </ContextMenuConfigContext.Provider>
      </GraphConfigContext.Provider>
    </ErrorBoundary>
  );
};
