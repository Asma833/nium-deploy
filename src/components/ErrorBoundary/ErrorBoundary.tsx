import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={() => (fallback ? <>{fallback}</> : <div>Something went wrong.</div>)}
            onError={(error, info) => {
                console.error('[ErrorBoundary] Uncaught error:', error, info);
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;
