import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingFallback from '@/components/loader/LoadingFallback';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[] ;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user || !localStorage.getItem('accessToken')) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = allowedRoles.length === 0 || 
    (user.role && allowedRoles.includes(user.role.toLowerCase()));

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
