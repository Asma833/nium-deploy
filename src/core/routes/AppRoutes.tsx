import { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { publicRoutes } from './Routes';
import { DEFAULT_ROUTES } from '@/core/constant/manageDefaultRoutes';
import { UserRole } from '@/features/auth/types/auth.types';
import { RootState } from '@/store';
import NotFoundPage from '@/components/common/NotFoundPage';
import UnauthorizedPage from '@/components/common/UnauthorizedPage';
import { CheckerRoutes } from './CheckerRoutes';
import { AdminRoutes } from './AdminRoutes';
import { MakerRoutes } from './MakerRoutes';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  const selectUser = useMemo(() => (state: RootState) => state.auth.user, []);
  const user = useSelector(selectUser);

  const getDefaultRoute = (userRole?: UserRole | null) =>
    userRole ? (DEFAULT_ROUTES[userRole] ?? '/login') : '/login';

  return (
    <Routes>
      {publicRoutes.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/*"
        element={
          <ProtectedRoute>
            <CheckerRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maker/*"
        element={
          <ProtectedRoute>
            <MakerRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={getDefaultRoute(user?.role.name)} replace />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
