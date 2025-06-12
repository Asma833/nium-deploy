import { ROUTES, getNavPath } from '@/core/constant/routePaths';

export const userTabs = [
  { label: 'List', path: getNavPath('ADMIN', ROUTES.ADMIN.NUSER)},
  { label: 'Create User', path: getNavPath('ADMIN', ROUTES.ADMIN.CREATEUSER)}
];
export const makerTabs = [
  { label: 'List', path: getNavPath('ADMIN', ROUTES.ADMIN.MAKER)},
  { label: 'Create Maker', path: getNavPath('ADMIN', ROUTES.ADMIN.CREATE_MAKER)}
]