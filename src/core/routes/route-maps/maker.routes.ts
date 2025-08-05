import { lazy } from 'react';
import { ROLES, ROUTES } from '../../constant/routePaths';

export const makerComponents = {
  CreateTransaction: lazy(() => import('@/features/maker/pages/create-transaction/CreateTransaction')),
  Update: lazy(() => import('@/features/maker/pages/update-doc-transaction/UpdateDocTransaction')),
  ViewTransaction: lazy(() => import('@/features/maker/pages/view-transaction/ViewTransaction')),
  ViewStatus: lazy(() => import('@/features/maker/pages/view-status/ViewStatusPage')),
  EditTransaction: lazy(() => import('@/features/maker/pages/edit-transaction/EditTransaction')),
};

const baseRole = ROLES.MAKER;

export const makerRoutes = [
  {
    path: ROUTES.MAKER.VIEW_STATUS,
    element: makerComponents.ViewStatus,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.MAKER.CREATE_TRANSACTION,
    element: makerComponents.CreateTransaction,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.MAKER.UPDATE_TRANSACTION,
    element: makerComponents.Update,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.MAKER.VIEW_TRANSACTION,
    element: makerComponents.ViewTransaction,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.MAKER.EDIT_TRANSACTION,
    element: makerComponents.EditTransaction,
    roles: [baseRole],
    permission: '',
  },
];
