import { BrowserRouter } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { AppRoutes } from "./core/routes/AppRoutes";
import LoadingFallback from "./components/loader/LoadingFallback";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ThemeProvider } from "./providers/ThemeProvider";
import { cleanupAxiosInterceptors } from './core/services/axios/axiosInstance';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "./store";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    return () => {
      // Cleanup axios interceptors on unmount
      cleanupAxiosInterceptors();
    };
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={<LoadingFallback />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Toaster />
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <AppRoutes />
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
