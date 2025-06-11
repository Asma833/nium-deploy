import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';
import CreateTransaction from '@/features/maker/pages/create-transaction/CreateTransaction';

export const makerComponents = {
  CreateTransaction: lazy(() => import('@/features/maker/pages/create-transaction/CreateTransaction')),
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
    element: CreateTransaction,
    roles: ['maker'],
    permission: '',
  },
];
