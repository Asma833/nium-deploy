import { ROUTES, getNavPath } from '@/core/constant/routePaths';

export const userTabs = [
  { label: 'Checker List', path: getNavPath('ADMIN', ROUTES.ADMIN.NUSER) },
  { label: 'Create Checker', path: getNavPath('ADMIN', ROUTES.ADMIN.CREATEUSER) },
];
export const makerTabs = [
  { label: 'Maker List', path: getNavPath('ADMIN', ROUTES.ADMIN.MAKER) },
  { label: 'Create Maker', path: getNavPath('ADMIN', ROUTES.ADMIN.CREATE_MAKER) },
];
