import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingFallback from '@/components/loader/LoadingFallback';
import { UserRole } from '@/features/auth/types/auth.types';
import { RootState } from '@/core/store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => ({
    ...state.auth,
    isLoading: state.auth.isLoading || false
  }));

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = allowedRoles.length === 0 || 
    (user.role && allowedRoles.includes(user.role));

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
