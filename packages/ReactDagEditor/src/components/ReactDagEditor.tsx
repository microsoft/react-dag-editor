import * as React from "react";
import { DefaultClipboard, defaultPort, DefaultStorage, line, rect } from "../built-in";
import { ContextMenuConfig, ContextMenuConfigContext, GraphConfig, GraphConfigContext } from "../contexts";
import { useConst } from "../hooks/useConst";
import { Debug } from "../utils/debug";
import { ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";
import { RegisterClipboard, RegisterEdge, RegisterNode, RegisterPort } from "./RegisterComponent";
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
  const clipboardStorage = useConst(() => new DefaultStorage());
  const clipboard = useConst(() => new DefaultClipboard(clipboardStorage));

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
      <GraphConfigContext.Provider value={React.useMemo(() => new GraphConfig(), [])}>
        <ContextMenuConfigContext.Provider value={useConst(() => new ContextMenuConfig())}>
          <ThemeProvider theme={theme} setTheme={setTheme}>
            <RegisterNode name="default" config={rect} />
            <RegisterEdge name="default" config={line} />
            <RegisterPort name="default" config={defaultPort} />
            <RegisterClipboard clipboard={clipboard} />
            <div style={props.style} className={props.className}>
              {props.children}
            </div>
          </ThemeProvider>
        </ContextMenuConfigContext.Provider>
      </GraphConfigContext.Provider>
    </ErrorBoundary>
  );
};
