import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';

const adminComponents = {
  User: lazy(() => import('@/features/admin/pages/n-user/n-user-table/NUserCreationTable')),
  UserCreation: lazy(() => import('@/features/admin/pages/n-user/user-creation-form/page')),
  UpdateUser: lazy(() => import('@/features/admin/pages/n-user/user-creation-form/page')),
  Partner: lazy(() => import('@/features/admin/pages/partners/partner-table/PartnerCreationTable')),
  PartnerCreation: lazy(() => import('@/features/admin/pages/partners/partner-creation-form/page')),
  UpdatePartner: lazy(() => import('@/features/admin/pages/partners/partner-creation-form/page')),
  Maker: lazy(() => import('@/features/admin/pages/maker/MakerTablePage')),
  CreateMaker: lazy(() => import('@/features/admin/pages/maker/maker-creation/MakerCreationPage')),
  UpdateMaker: lazy(() => import('@/features/admin/pages/maker/maker-creation/MakerCreationPage')),
  ViewAll: lazy(() => import('@/features/admin/pages/view-all/view-table/ViewAllTablePage')),
};

export const adminRoutes = [
  {
    path: ROUTES.ADMIN.NUSER,
    element: adminComponents.User,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.CREATEUSER,
    element: adminComponents.UserCreation,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.UPDATEUSER,
    element: adminComponents.UpdateUser,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.PARTNER,
    element: adminComponents.Partner,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.MAKER,
    element: adminComponents.Maker,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.CREATE_MAKER,
    element: adminComponents.CreateMaker,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.UPDATE_MAKER,
    element: adminComponents.UpdateMaker,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.VIEWALL,
    element: adminComponents.ViewAll,
    roles: ['checker'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.CREATEPARTNER,
    element: adminComponents.PartnerCreation,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.UPDATEPARTNER,
    element: adminComponents.UpdatePartner,
    roles: ['admin'],
    permission: '',
  },
];
