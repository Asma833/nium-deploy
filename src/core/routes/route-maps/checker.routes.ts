import { lazy } from "react";
import { ROUTES } from "../constants";

const checkerComponents = {
    Dashboard: lazy(() => import("@/features/bmf-checker/pages/dashboard/page/DashboardPage")),
    Assign: lazy(() => import("@/features/bmf-checker/pages/assign/assign-table/AssignCreationTable")),
    UpdateIncident: lazy(() => import("@/features/bmf-checker/pages/updateIncident/update-incident-table/UpdateIncidentCreationTable")),
    ViewAll: lazy(() => import("@/features/bmf-checker/pages/view-all/view-table/ViewAllTable")),
  }
export const checkerRoutes = [
  {
    path: ROUTES.BMFCHECKER.DASHBOARD,
    element: checkerComponents.Dashboard,
    roles: ["checker", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: ROUTES.BMFCHECKER.ASSIGN,
    element: checkerComponents.Assign,
    roles: ["checker", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: ROUTES.BMFCHECKER.UPDATE_INCIDENT,
    element: checkerComponents.UpdateIncident,
    roles: ["checker", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: ROUTES.BMFCHECKER.VIEWALL,
    element: checkerComponents.ViewAll,
    roles: ["checker", "co-admin"],
    permission: "view_dashboard",
  },
]