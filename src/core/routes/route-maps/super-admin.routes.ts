import { lazy } from "react";
import { ROUTES } from "../constants";

const superAdminComponents = {
    User: lazy(() => import("@/features/super-admin/pages/n-user/n-user-table/NUserCreationTable")),
    UserCreation : lazy(()=> import("@/features/super-admin/pages/n-user/user-creation-form/page")),
    UpdateUser : lazy(()=> import("@/features/super-admin/pages/n-user/user-creation-form/page"))
  }
export const superAdminRoutes = [
  {
    path: ROUTES.SUPERADMIN.NUSER,
    element: superAdminComponents.User,
    roles: ["maker", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: ROUTES.SUPERADMIN.CREATEUSER,
    element: superAdminComponents.UserCreation,
    roles: ["maker", "co-admin"],
    permission: "view_dashboard",
  },
  {
    path: ROUTES.SUPERADMIN.UPDATEUSER,
    element: superAdminComponents.UpdateUser,
    roles: ["maker", "co-admin"],
    permission: "view_dashboard",
  }
 
]