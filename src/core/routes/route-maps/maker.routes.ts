import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';

export const makerComponents = {
  CreateTransaction: lazy(() => import('@/features/maker/pages/create-transaction/CreateTransaction')),
  Update: lazy(() => import('@/features/maker/pages/update-transaction/UpdateTransaction')),
  ViewStatus: lazy(() => import('@/features/maker/pages/view-status/VIewStatus')),
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
];
