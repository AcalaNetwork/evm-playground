import { Box } from 'components/layout';
import React, { ErrorInfo } from 'react';

type ErrorBoundaryState = {
  error: Error | null;
  fallbackRender?: (props: {
    error: Error;
  }) => React.ReactElement<unknown, string | React.FunctionComponent | typeof React.Component>;
};

export class ErrorBoundary extends React.Component<unknown, ErrorBoundaryState> {
  constructor(props: unknown) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log({
      ...error,
      ...errorInfo,
      fatal: true
    });
  }

  render() {
    const { fallbackRender, error } = this.state;

    if (error !== null) {
      if (typeof fallbackRender === 'function') {
        return fallbackRender({ error });
      } else {
        return <Box>ERROR</Box>;
      }
    }

    return this.props.children;
  }
}
