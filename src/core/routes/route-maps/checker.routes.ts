import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';

export const checkerComponents = {
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
    () => import('@/features/checker/pages/view-all/view-table/ViewAllTablePage')
  ),

  CompletedTransaction: lazy(
    () =>
      import(
        '@/features/checker/pages/completed-transactions/CompletedTransactionTable'
      )
  ),
};
export const checkerRoutes = [
  {
    path: ROUTES.CHECKER.DASHBOARD,
    element: checkerComponents.Dashboard,
    roles: ['checker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.CHECKER.ASSIGN,
    element: checkerComponents.Assign,
    roles: ['checker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.CHECKER.UPDATE_INCIDENT,
    element: checkerComponents.UpdateIncident,
    roles: ['checker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.CHECKER.VIEWALL,
    element: checkerComponents.ViewAll,
    roles: ['checker', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.CHECKER.COMPLETEDTRANSACTIONS,
    element: checkerComponents.CompletedTransaction,
    roles: ['checker', 'co-admin'],
    permission: 'view_dashboard',
  },
];
