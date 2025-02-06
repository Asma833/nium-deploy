import { Routes, Route } from "react-router-dom";
import { adminRoutes } from "./RoutesConfig";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminLayout from "@/features/admin-portal/dashboard/components/AdminLayout";

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
    </Routes>
  );
};
