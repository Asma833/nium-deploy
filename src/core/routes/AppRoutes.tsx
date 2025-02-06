import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { publicRoutes } from "./RoutesConfig";
import { DEFAULT_ROUTES } from "@/core/constant/routes";
import { UserRole } from "@/features/auth/types/auth.types";
import { RootState } from "@/store";
import { AdminRoutes } from "./AdminRoutes";

export const AppRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const getDefaultRoute = (userRole?: UserRole | null) =>
    userRole ? DEFAULT_ROUTES[userRole] ?? "/login" : "/login";

  return (
    <Routes>
      {publicRoutes.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}

      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route
        path="/"
        element={<Navigate to={getDefaultRoute(user?.role)} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={getDefaultRoute(user?.role)} replace />}
      />
    </Routes>
  );
};
