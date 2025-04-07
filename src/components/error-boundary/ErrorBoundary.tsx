import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryProps } from './error-boundary.types';
import FallbackPage from '../common/FallbackPage';

const DefaultFallback: React.FC = () => <FallbackPage />;

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={() =>
        fallback ? <>{fallback}</> : <DefaultFallback />
      }
      onError={(error, info) => {}}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
