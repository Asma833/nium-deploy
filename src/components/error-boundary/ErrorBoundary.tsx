import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryProps } from './error-boundary.types';



const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={() => (fallback ? <>{fallback}</> : <div>Something went wrong.</div>)}
            onError={(error, info) => {
            }}
            >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;
