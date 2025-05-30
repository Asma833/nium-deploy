import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { DEFAULT_ROUTES } from '@/core/constant/routes';
import LoadingFallback from '@/components/loader/LoadingFallback';

interface AuthRedirectGuardProps {
  children: React.ReactNode;
}

const selectAuthState = createSelector(
  (state: RootState) => state.auth,
  (auth) => ({
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || false,
  })
);

export const AuthRedirectGuard: React.FC<AuthRedirectGuardProps> = ({
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useSelector(selectAuthState);

  // Show loading while checking authentication status
  if (isLoading) {
    return <LoadingFallback />;
  }

  // If user is authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    const defaultRoute = DEFAULT_ROUTES[user.role.name];
    return <Navigate to={defaultRoute || '/dashboard'} replace />;
  }

  // If not authenticated, show the auth page (login, forgot password, etc.)
  return <>{children}</>;
};
