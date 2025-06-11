import { UserRole } from '../../features/auth/types/auth.types';
import { ROUTES, getNavPath } from './routePaths';

export const DEFAULT_ROUTES: Record<UserRole, string> = {
  admin: getNavPath('ADMIN', ROUTES.ADMIN.NUSER),
  checker: getNavPath('CHECKER', ROUTES.CHECKER.VIEWALL),
  maker: getNavPath('MAKER', ROUTES.MAKER.CREATE_TRANSACTION),
} as const;
