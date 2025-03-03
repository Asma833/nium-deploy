import { lazy } from "react";
import { ROUTES } from "../constants";

const adminNewComponents = {
    User: lazy(() => import("@/features/admin/pages/n-user/n-user-table/NUserCreationTable")),
    UserCreation : lazy(()=> import("@/features/admin/pages/n-user/user-creation-form/page"))
  }
export const adminNewRoutes = [
  {
    path: ROUTES.ADMINNEW.NUSER,
    element: adminNewComponents.User,
    roles: ["checker", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: ROUTES.ADMINNEW.CREATEUSER,
    element: adminNewComponents.UserCreation,
    roles: ["checker", "co-admin"],
    permission: "view_dashboard",
  }
 
]