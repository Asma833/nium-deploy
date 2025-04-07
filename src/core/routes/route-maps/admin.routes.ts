import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';

// prettier-ignore
const adminComponents = {
    Dashboard: lazy(() => import("@/features/admin-portal/pages/dashboard/DashboardPage")),
    UserPage: lazy(() => import("@/features/admin-portal/pages/user-management/n-user/page/UserPage")),
    AgentBranchUser: lazy(() => import("@/features/admin-portal/pages/user-management/agent-branch-user-creation/page/AgentBranchUserCreationPage")),
    CreateBranchNewUser:lazy(() => import("@/features/admin-portal/pages/user-management/agent-branch-user-creation/page/AgentBranchUserRegistrationPage")),
    AgentProfileSummary: lazy(() => import("@/features/admin-portal/pages/user-management/agent-profile-creation/pages/agent-profile-summary/page")),
    AgentProfileCreation: lazy(() => import("@/features/admin-portal/pages/user-management/agent-profile-creation/pages/create-new-agent/page")),
    RateMarginDetails: lazy(() => import("@/features/admin-portal/pages/master/rate-master/rate-margin/RateMarginTable")),
  };

export const adminRoutes = [
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: adminComponents.Dashboard,
    roles: ['admin', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.USER_MANAGEMENT.N_USER,
    element: adminComponents.UserPage,
    roles: ['admin', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.USER_MANAGEMENT.AGENT_BRANCH,
    element: adminComponents.AgentBranchUser,
    roles: ['admin', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.USER_MANAGEMENT.CREATE_BRANCH_NEW_USER,
    element: adminComponents.CreateBranchNewUser,
    roles: ['admin', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.USER_MANAGEMENT.AGENT_PROFILE,
    element: adminComponents.AgentProfileSummary,
    roles: ['admin', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.USER_MANAGEMENT.CREATE_AGENT,
    element: adminComponents.AgentProfileCreation,
    roles: ['admin', 'co-admin'],
    permission: 'view_dashboard',
  },
  {
    path: ROUTES.ADMIN.MASTER.RATE_MASTER.RATE_MARGIN,
    element: adminComponents.RateMarginDetails,
    roles: ['admin', 'co-admin'],
    permission: 'view_dashboard',
  },
];
