import Login from "@/features/auth/pages/login/Login";
import { lazy } from "react";

// Admin components
const Dashboard = lazy(
  () => import("@/features/admin-portal/dashboard/pages/dashboard")
);

// Public routes
export const publicRoutes = [
  {
    path: "/login",
    element: Login,
    roles: ["*"],
  },
];

// Admin routes configuration
export const adminRoutes = [
  {
    path: "/dashboard", // Changed from /admin/dashboard since we're already under /admin/* route
    element: Dashboard,
    roles: ["admin", "co-admin"],
    permission: "view_dashboard",
  },
  // Add other admin routes here
];
