import { UserRole } from '../../features/auth/types/auth.types';

export const ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  CO_ADMIN: 'co-admin',
  MAKER: 'maker',
  CHECKER: 'checker'
} as const;

export const DEFAULT_ROUTES: Record<UserRole, string> = {
  'admin': '/admin/dashboard',
  'co-admin': '/dashboard',
  'maker': '/transactions',
  // 'checker': '/checker/dashboard'
  'checker': '/checker/users'
} as const;
