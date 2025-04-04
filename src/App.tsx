import { BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// compometns import
import { AppRoutes } from './core/routes/AppRoutes';
import LoadingFallback from './components/loader/LoadingFallback';
import { ThemeProvider } from './providers/ThemeProvider';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import { MUIProviders } from './providers/MUIProviders';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <MUIProviders>
      <ThemeProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingFallback />} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Toaster />
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <TooltipProvider>
                      <AppRoutes />
                    </TooltipProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                  </Suspense>
                </ErrorBoundary>
              </BrowserRouter>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </MUIProviders>
  );
};

export default App;
