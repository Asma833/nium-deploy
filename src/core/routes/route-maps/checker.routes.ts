import { lazy } from 'react';
import { ROLES, ROUTES } from '../../constant/routePaths';

export const checkerComponents = {
  Dashboard: lazy(() => import('@/features/checker/pages/dashboard/DashboardPage')),
  Assign: lazy(() => import('@/features/checker/pages/assign/assign-table/AssignCreationTable')),

  UpdateIncident: lazy(
    () => import('@/features/checker/pages/update-incident/update-incident-table/UpdateIncidentTable')
  ),
  ViewAll: lazy(() => import('@/features/checker/pages/view-all/view-table/ViewAllTablePage')),

  CompletedTransaction: lazy(() => import('@/features/checker/pages/completed-transactions/CompletedTransactionTable')),
};

const baseRole = ROLES.CHECKER;

export const checkerRoutes = [
  {
    path: ROUTES.CHECKER.DASHBOARD,
    element: checkerComponents.Dashboard,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.CHECKER.ASSIGN,
    element: checkerComponents.Assign,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.CHECKER.UPDATE_INCIDENT,
    element: checkerComponents.UpdateIncident,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.CHECKER.VIEWALL,
    element: checkerComponents.ViewAll,
    roles: [baseRole],
    permission: '',
  },
  {
    path: ROUTES.CHECKER.COMPLETEDTRANSACTIONS,
    element: checkerComponents.CompletedTransaction,
    roles: [baseRole],
    permission: '',
  },
];
