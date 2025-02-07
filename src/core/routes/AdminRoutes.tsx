import { Routes, Route } from "react-router-dom";
import { adminRoutes } from "./RoutesConfig";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminLayout from "@/features/admin-portal/components/AdminLayout";
import NotFoundPage from "@/components/common/NotFoundPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      {adminRoutes.map(({ path, element: Element, roles, permission }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute roles={roles} permission={permission}>
              <AdminLayout>
                <Element />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <AdminLayout>
            <NotFoundPage />
          </AdminLayout>
        }
      />
    </Routes>
  );
};
