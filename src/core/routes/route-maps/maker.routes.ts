import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';

export const makerComponents = {
  Dashboard: lazy(
    () => import('@/features/checker/pages/dashboard/DashboardPage')
  ),
  Assign: lazy(
    () =>
      import('@/features/checker/pages/assign/assign-table/AssignCreationTable')
  ),

  UpdateIncident: lazy(
    () =>
      import(
        '@/features/checker/pages/update-incident/update-incident-table/UpdateIncidentTable'
      )
  ),
  ViewAll: lazy(
    () =>
      import('@/features/checker/pages/view-all/view-table/ViewAllTablePage')
  ),

  CompletedTransaction: lazy(
    () =>
      import(
        '@/features/checker/pages/completed-transactions/CompletedTransactionTable'
      )
  ),
};
export const makerRoutes = [
  {
    path: ROUTES.CHECKER.DASHBOARD,
    element: makerComponents.Dashboard,
    roles: ['maker'],
    permission: '',
  },
  {
    path: ROUTES.CHECKER.ASSIGN,
    element: makerComponents.Assign,
    roles: ['maker'],
    permission: '',
  },
];
