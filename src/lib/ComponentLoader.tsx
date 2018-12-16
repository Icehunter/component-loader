import * as React from 'react';

import { AsyncComponentLoader, AsyncComponentLoaderProps } from './AsyncComponentLoader';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div
      role="alert"
      style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

type OnErrorHandler = (
  error: Error,
  info: {
    componentStack: string;
  }
) => void;

export interface ComponentLoaderProps<T> extends AsyncComponentLoaderProps<T> {
  onError?: OnErrorHandler;
  FallbackComponent?: React.ComponentType<FallbackProps>;
}

export const ComponentLoader = <T extends object>(props: ComponentLoaderProps<T>): JSX.Element => {
  const { onError, FallbackComponent = ErrorFallback, ...rest } = props;

  const handleOnError: OnErrorHandler = React.useCallback(
    (error, info) => {
      if (onError) {
        onError(error, info);
      }
    },
    [onError]
  );

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={handleOnError}>
      <AsyncComponentLoader {...rest} />
    </ErrorBoundary>
  );
};
