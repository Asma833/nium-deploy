import { Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./RoutesConfig";
import Login from "../../features/auth/pages/login/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { DEFAULT_ROUTES } from "../../features/auth/context/AuthContext";

export const AppRoutes = () => {
  const { user } = useAuth();

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
          <Navigate to={user ? DEFAULT_ROUTES[user.role] : "/login"} replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={user ? DEFAULT_ROUTES[user.role] : "/login"} replace />
        }
      />
    </Routes>
  );
};
