import * as React from "react";

export interface IErrorBoundaryProps {
  renderOnError?(error?: Error, errorInfo?: React.ErrorInfo, children?: React.ReactNode): React.ReactChild;
}

export interface IErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<IErrorBoundaryProps>, IErrorBoundaryState> {
  public constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error(error);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.renderOnError) {
      return this.props.renderOnError(this.state.error, this.state.errorInfo, this.props.children) ?? null;
    }

    const componentStackLines = this.state.errorInfo ? this.state.errorInfo.componentStack?.split("\n") : [];

    return (
      <div style={{ color: "red" }}>
        <h1>Something went wrong.</h1>
        <p>{`Error: ${this.state.error}`}</p>
        <p>{`ErrorInfo: ${JSON.stringify(this.state.errorInfo)}`}</p>
        <h2>Component Stack</h2>
        {(componentStackLines ?? []).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  }
}
