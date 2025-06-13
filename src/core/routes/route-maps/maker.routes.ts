import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';

export const makerComponents = {
  CreateTransaction: lazy(() => import('@/features/maker/pages/create-transaction/CreateTransaction')),
  Update: lazy(() => import('@/features/maker/pages/update-doc-transaction/UpdateDocTransaction')),
  ViewTransaction: lazy(() => import('@/features/maker/pages/view-transaction/ViewTransaction')),
  ViewStatus: lazy(() => import('@/features/maker/pages/view-status/ViewStatusPage')),
  EditTransaction: lazy(() => import('@/features/maker/pages/edit-transaction/EditTransaction')),
};
export const makerRoutes = [
  {
    path: ROUTES.MAKER.VIEW_STATUS,
    element: makerComponents.ViewStatus,
    roles: ['maker'],
    permission: '',
  },
  {
    path: ROUTES.MAKER.CREATE_TRANSACTION,
    element: makerComponents.CreateTransaction,
    roles: ['maker'],
    permission: '',
  },
  {
    path: ROUTES.MAKER.UPDATE_TRANSACTION,
    element: makerComponents.Update,
    roles: ['maker'],
    permission: '',
  },
  {
    path: ROUTES.MAKER.VIEW_TRANSACTION,
    element: makerComponents.ViewTransaction,
    roles: ['maker'],
    permission: '',
  },
  {
    path: ROUTES.MAKER.EDIT_TRANSACTION,
    element: makerComponents.EditTransaction,
    roles: ['maker'],
    permission: '',
  },
];
