import { Routes, Route } from "react-router-dom";
import { superAdminRoutes } from "./RoutesConfig";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFoundPage from "@/components/common/NotFoundPage";
import Layout from "@/features/super-admin/components/SuperAdminLayout";

export const SuperAdminRoutes = () => {
  return (
    
    <Routes>
    {superAdminRoutes.map(({ path, element: Element, roles, permission }) => (
      <Route
        key={path}
        path={path}
        element={
          <ProtectedRoute roles={roles} permission={permission}>
            <Layout>
              <Element />
            </Layout>
          </ProtectedRoute>
        }
      />
    ))}
    <Route
      path="*"
      element={
        <Layout>
          <NotFoundPage />
        </Layout>
      }
    />
  </Routes>
  );
};
