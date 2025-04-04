import { UserRole } from '../../features/auth/types/auth.types';

export const ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  CO_ADMIN: 'co-admin',
  MAKER: 'maker',
  CHECKER: 'checker',
} as const;

export const DEFAULT_ROUTES: Record<UserRole, string> = {
  admin: '/admin/users',
  'co-admin': '/dashboard',
  maker: '/transaction',
  checker: '/checker/dashboard',
  // 'admin': '/admin/dashboard',
} as const;
