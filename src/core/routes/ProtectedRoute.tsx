import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import LoadingFallback from '@/components/loader/LoadingFallback';
import { UserRole } from '@/features/auth/types/auth.types';
import { RootState } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  roles: string[];
  permission?: string;
}

const selectAuth = (state: RootState) => state.auth;

const selectAuthState = createSelector(
  selectAuth,
  (auth) => ({
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || false
  })
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, isLoading } = useSelector(selectAuthState);

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
