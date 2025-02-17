import { lazy } from "react";

// Admin components
const DashboardPage = lazy(
  () => import("@/features/admin-portal/pages/dashboard/DashboardPage")
);
const AgentBranchUserCreationPage = lazy(
  () =>
    import(
      "@/features/admin-portal/pages/user-management/agent-branch-user-creation/page/AgentBranchUserCreationPage"
    )
);

const UserPage = lazy(
  () =>
    import("@/features/admin-portal/pages/user-management/n-user/page/UserPage")
);

// Auth components
const SendEmailPage = lazy(
  () => import("@/features/auth/pages/send-email/SendEmailPage")
);
const ForgetPasswordPage = lazy(
  () => import("@/features/auth/pages/forget-password/ForgetPasswordPage")
);
const Login = lazy(() => import("@/features/auth/pages/login/LoginPage"));

const ResetLinkConfirmationAlert = lazy(
  () => import("@/features/auth/pages/send-email/ResetLinkConfirmationAlert")
);

// Public routes
export const publicRoutes = [
  {
    path: "/login",
    element: Login,
    roles: ["*"],
  },
  {
    path: "/forget-password",
    element: ForgetPasswordPage,
    roles: ["*"],
  },
  {
    path: "/send-password-reset-link",
    element: SendEmailPage,
    roles: ["*"],
  },
  {
    path: "/reset-link-confirmation",
    element: ResetLinkConfirmationAlert,
    roles: ["*"],
  },
];

// Admin routes configuration
export const adminRoutes = [
  {
    path: "/dashboard",
    element: DashboardPage,
    roles: ["admin", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: "/user-management/n-user",
    element: UserPage,
    roles: ["admin", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: "/user-management/agent-branch-user-creation",
    element: AgentBranchUserCreationPage,
    roles: ["admin", "co-admin"],
    permission: "view_dashboard",
  },

  // Add other admin routes here
];
