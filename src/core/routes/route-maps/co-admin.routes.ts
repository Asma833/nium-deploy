import { lazy } from 'react';
import { ROUTES } from '../routePaths';
import { checkerComponents } from './checker.routes';

const coAdminComponents = {
  User: lazy(
    () =>
      import('@/features/co-admin/pages/n-user/n-user-table/NUserCreationTable')
  ),
  UserCreation: lazy(
    () => import('@/features/co-admin/pages/n-user/user-creation-form/page')
  ),
  UpdateUser: lazy(
    () => import('@/features/co-admin/pages/n-user/user-creation-form/page')
  ),
  Partner: lazy(
    () =>
      import(
        '@/features/co-admin/pages/partners/partner-table/PartnerCreationTable'
      )
  ),
  PartnerCreation: lazy(
    () =>
      import('@/features/co-admin/pages/partners/partner-creation-form/page')
  ),
  UpdatePartner: lazy(
    () =>
      import('@/features/co-admin/pages/partners/partner-creation-form/page')
  ),
  ViewAll: lazy(
    () => import('@/features/co-admin/pages/view-all/view-table/ViewAllTable')
  ),
};

export const coAdminRoutes = [
  {
    path: ROUTES.COADMIN.NUSER,
    element: coAdminComponents.User,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.COADMIN.CREATEUSER,
    element: coAdminComponents.UserCreation,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.COADMIN.UPDATEUSER,
    element: coAdminComponents.UpdateUser,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.COADMIN.PARTNER,
    element: coAdminComponents.Partner,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.COADMIN.VIEWALL,
    element: coAdminComponents.ViewAll,
    roles: ['checker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.COADMIN.CREATEPARTNER,
    element: coAdminComponents.PartnerCreation,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.COADMIN.UPDATEPARTNER,
    element: coAdminComponents.UpdatePartner,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
];
