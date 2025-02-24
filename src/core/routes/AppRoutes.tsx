import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { publicRoutes } from "./RoutesConfig";
import { DEFAULT_ROUTES } from "@/core/constant/routes";
import { UserRole } from "@/features/auth/types/auth.types";
import { RootState } from "@/store";
import { AdminRoutes } from "./AdminRoutes";
import NotFoundPage from "@/components/common/NotFoundPage";

export const AppRoutes = () => {
  const selectUser = useMemo(
    () => (state: RootState) => state.auth.user,
    []
  );
  const user = useSelector(selectUser);

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
        element={<Navigate to={getDefaultRoute(user?.role.name)} replace />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
