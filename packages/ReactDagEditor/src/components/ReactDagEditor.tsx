import * as React from "react";
import { ContextMenuConfig, ContextMenuConfigContext, IDispatch } from "../contexts";
import { GraphController } from "../controllers/GraphController";
import { useConst } from "../hooks/useConst";
import type { IGraphState } from "../models/state";
import { Debug } from "../utils/debug";
import { noop } from "../utils/noop";
import { ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";
import { GraphStateStore } from "./Graph/GraphStateStore";
import { IThemeProviderProps, ThemeProvider } from "./ThemeProvider";

/**
 * ReactDagEditor props
 */
export interface IReactDagEditorProps<NodeData = unknown, EdgeData = unknown, PortData = unknown, Action = never>
  extends IThemeProviderProps {
  /**
   * Additional css styles to apply to the container element.
   */
  style?: React.CSSProperties;
  /**
   * Additional css class to apply to the container element.
   */
  className?: string;
  state: IGraphState<NodeData, EdgeData, PortData>;
  dispatch: IDispatch<NodeData, EdgeData, PortData, Action>;
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
export const ReactDagEditor: React.FunctionComponent<IReactDagEditorProps> = (props) => {
  React.useEffect(() => {
    if (props.handleWarning) {
      Debug.warn = props.handleWarning;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = props.handleError?.bind(null);

  const { theme, setTheme, state, dispatch, getGlobalEventTarget } = props;

  const graphController = useConst(() => new GraphController(state, dispatch));
  graphController.UNSAFE_latestState = state;
  React.useLayoutEffect(() => {
    graphController.state = state;
    graphController.dispatchDelegate = dispatch;
    graphController.getGlobalEventTargetImpl = getGlobalEventTarget;
  }, [dispatch, getGlobalEventTarget, graphController, state]);
  React.useEffect(() => {
    return () => {
      graphController.dispatchDelegate = noop;
    };
  }, [graphController]);

  return (
    <ErrorBoundary renderOnError={handleError}>
      <GraphStateStore state={state} dispatch={dispatch} graphController={graphController}>
        <ContextMenuConfigContext.Provider value={useConst(() => new ContextMenuConfig())}>
          <ThemeProvider theme={theme} setTheme={setTheme}>
            <div style={props.style} className={props.className}>
              {props.children}
            </div>
          </ThemeProvider>
        </ContextMenuConfigContext.Provider>
      </GraphStateStore>
    </ErrorBoundary>
  );
};
