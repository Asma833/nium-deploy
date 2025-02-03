import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { routes } from "./RoutesConfig";
import Login from "../../features/auth/pages/login/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { DEFAULT_ROUTES } from "@/features/auth/constants/routes";
import { UserRole } from "@/features/auth/types/auth.types";
import { RootState } from "@/store";

export const AppRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const getDefaultRoute = (userRole?: UserRole | null) => {
    if (!userRole) return "/login";
    return DEFAULT_ROUTES[userRole] || "/login";
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {routes.map(({ path, element: Element, roles, permission }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute allowedRoles={roles}>
              <Element />
            </ProtectedRoute>
          }
        />
      ))}
      <Route
        path="/"
        element={
          <Navigate to={getDefaultRoute(user?.role)} replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={getDefaultRoute(user?.role)} replace />
        }
      />
    </Routes>
  );
};
