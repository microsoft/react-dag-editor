# Wrapper components

Wrapper components transparently add functionalities or abilities to their children component.

## `<ReactDagEditor />`

```typescript
import { ReactDagEditor } from "react-dag-editor";
```

All other components in the package react-dag-editor should be wrapped by this one. It initialize context and providers.

## `<ReactDagEditor />` props

```typescript
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
   * Fired when ReactDagEditor catches an error. And the return value will be rendered.
   */
  handleError?(error?: Error, errorInfo?: React.ErrorInfo, children?: React.ReactNode): React.ReactChild;
```

## `<GraphStateStore />`

Use this one to initialize the state and add custom middlewares.
Permit the wrapped components to access the state via propsAPI or built-in hooks.

## `<GraphStateStore />` props

```typescript
  /**
   * The propsAPI reference.
   */
  propsAPIRef?: React.Ref<IPropsAPI<NodeData, EdgeData, PortData> | null>;
  /**
   * the initial graph data model.
   */
  data?: GraphModel<NodeData, EdgeData, PortData>;
  defaultTransformMatrix?: ITransformMatrix;
  middleware?: IGraphReducer<NodeData, EdgeData, PortData, Action>;
  onStateChanged?: IDispatchCallback<NodeData, EdgeData, PortData>;
```
