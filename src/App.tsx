import { BrowserRouter, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { AppRoutes } from "./core/routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import LoadingFallback from "./components/loader/LoadingFallback";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
// import Footer from "./components/layout/Footer/Footer";
// import Header from "./components/layout/Header/Header";
//import MainLayout from "./components/layout/Main-layout/Main-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
// interface LayoutWrapperProps {
//   children: React.ReactNode;
// }
// const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
//   const location = useLocation();
//   // Exclude login page or other pages from the layout
//   const isLayoutRequired = location.pathname !== "/login";

//   return isLayoutRequired ? <MainLayout>{children}</MainLayout> : <>{children}</>;
// };

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster />
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
             {/* <Header/> */}
              <AppRoutes />
             {/* <Footer/> */}
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
