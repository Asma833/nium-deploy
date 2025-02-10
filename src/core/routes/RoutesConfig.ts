import UserPage from "@/features/admin-portal/pages/n-user/UserPage";

import { lazy } from "react";

// Admin components
const DashboardPage = lazy(
  () => import("@/features/admin-portal/pages/dashboard/DashboardPage")
);

// Auth components
const SendEmailPage = lazy(
  () => import("@/features/auth/pages/send-email/SendEmailPage")
);
const ForgetPasswordPage = lazy(
  () => import("@/features/auth/pages/forget-password/ForgetPasswordPage")
);
const Login = lazy(() => import("@/features/auth/pages/login/LoginPage"));

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
    path: "/n-user",
    element: UserPage,
    roles: ["admin", "co-admin"],
    permission: "view_dashboard",
  },
  // Add other admin routes here
];
