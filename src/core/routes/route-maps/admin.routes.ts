import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';
import { checkerComponents } from './checker.routes';

const adminComponents = {
  User: lazy(
    () =>
      import('@/features/admin/pages/n-user/n-user-table/NUserCreationTable')
  ),
  UserCreation: lazy(
    () => import('@/features/admin/pages/n-user/user-creation-form/page')
  ),
  UpdateUser: lazy(
    () => import('@/features/admin/pages/n-user/user-creation-form/page')
  ),
  Partner: lazy(
    () =>
      import(
        '@/features/admin/pages/partners/partner-table/PartnerCreationTable'
      )
  ),
  PartnerCreation: lazy(
    () => import('@/features/admin/pages/partners/partner-creation-form/page')
  ),
  UpdatePartner: lazy(
    () => import('@/features/admin/pages/partners/partner-creation-form/page')
  ),
  ViewAll: lazy(
    () => import('@/features/admin/pages/view-all/view-table/ViewAllTable')
  ),
};

export const adminRoutes = [
  {
    path: ROUTES.ADMIN.NUSER,
    element: adminComponents.User,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.CREATEUSER,
    element: adminComponents.UserCreation,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.UPDATEUSER,
    element: adminComponents.UpdateUser,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.PARTNER,
    element: adminComponents.Partner,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.VIEWALL,
    element: adminComponents.ViewAll,
    roles: ['checker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.CREATEPARTNER,
    element: adminComponents.PartnerCreation,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.UPDATEPARTNER,
    element: adminComponents.UpdatePartner,
    roles: ['maker', 'co-admin'],
    permission: 'view_dashboard',
  },
];
