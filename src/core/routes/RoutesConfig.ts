import AgentReport from "@/features/admin-portal/agent-report/pages/AgentReport";
import Dashboard from "@/features/admin-portal/dashboard/pages/dashboard";
import AgentProfileCreation from "@/features/admin-portal/user-management/pages/AgentProfileCreation";

/**
 * Route configuration for the application.
 * Each route object defines the following:
 * @typedef {Object} RouteConfig
 * @property {string} path - The URL path for the route
 * @property {React.ComponentType} element - The component to render for this route
 * @property {string[]} roles - Array of roles allowed to access this route
 * @property {Permission} permission - Required permission to access this route.
 *                                    This maps to the Permission type defined in auth.types.ts
 *                                    Possible values: "view_dashboard" | "manage_agents" |
 *                                    "view_transactions" | "approve_transactions"
 */
export const routes = [
  {
    path: "/dashboard",
    element: Dashboard,
    roles: ["admin", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: "/agent-profile-creation",
    element: AgentProfileCreation,
    roles: ["admin", "co-admin"],
    permission: "",
  },
  {
    path: "/transactions",
    element: AgentReport,
    roles: ["maker"],
    permission: "",
  },
  {
    path: "/pending-approvals",
    element: AgentReport,
    roles: ["checker"],
    permission: "",
  },
  {
    path: "/agents",
    element: AgentReport,
    roles: ["admin", "co-admin"],
    permission: "",
  },
];
