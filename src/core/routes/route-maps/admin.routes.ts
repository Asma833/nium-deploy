import { lazy } from 'react';
import { ROLES, ROUTES } from '../../constant/routePaths';

const adminComponents = {
  User: lazy(() => import('@/features/admin/pages/n-user/CheckerTablePage')),
  UserCreation: lazy(() => import('@/features/admin/pages/n-user/n-user-creation/UserCreationPage')),
  UpdateUser: lazy(() => import('@/features/admin/pages/n-user/n-user-creation/UserCreationPage')),
  Partner: lazy(() => import('@/features/admin/pages/partners/partner-table/PartnerCreationTable')),
  PartnerCreation: lazy(() => import('@/features/admin/pages/partners/partner-creation-form/page')),
  UpdatePartner: lazy(() => import('@/features/admin/pages/partners/partner-creation-form/page')),
  Maker: lazy(() => import('@/features/admin/pages/maker/MakerTablePage')),
  CreateMaker: lazy(() => import('@/features/admin/pages/maker/maker-creation/MakerCreationPage')),
  UpdateMaker: lazy(() => import('@/features/admin/pages/maker/maker-creation/MakerCreationPage')),
  ViewAll: lazy(() => import('@/features/admin/pages/view-all/view-table/ViewAllTablePage')),

  PurposeMaster: lazy(() => import('@/features/admin/pages/master/purpose-master/PurposeMasterTablePage')),
  PurposeMasterCreation: lazy(
    () => import('@/features/admin/pages/master/purpose-master/create-purpose-master/CreatePurposeMasterPage')
  ),
  DocumentMaster: lazy(
    () => import('@/features/admin/pages/master/purpose-master/purpose-documents/document-table/PurposeDocumentsTable')
  ),
};

const baseRole = ROLES.ADMIN; // Admin routes are accessible to admin role

export const adminRoutes = [
  {
    path: ROUTES.ADMIN.NUSER,
    element: adminComponents.User,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.CREATEUSER,
    element: adminComponents.UserCreation,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.UPDATEUSER,
    element: adminComponents.UpdateUser,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.PARTNER,
    element: adminComponents.Partner,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.MAKER,
    element: adminComponents.Maker,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.CREATE_MAKER,
    element: adminComponents.CreateMaker,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.UPDATE_MAKER,
    element: adminComponents.UpdateMaker,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.VIEWALL,
    element: adminComponents.ViewAll,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.CREATEPARTNER,
    element: adminComponents.PartnerCreation,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.UPDATEPARTNER,
    element: adminComponents.UpdatePartner,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.MASTER.PURPOSE_MASTER,
    element: adminComponents.PurposeMaster,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.MASTER.DOCUMENT_MASTER,
    element: adminComponents.DocumentMaster,
    roles: ['admin'],
    permission: '',
  },
  {
    path: ROUTES.ADMIN.MASTER.CREATE_PURPOSE_MASTER,
    element: adminComponents.PurposeMasterCreation,
    roles: ['admin'],
    permission: '',
  },
];
