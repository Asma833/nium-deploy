
const userPrefix = "/checker";

import { LayoutDashboard, ClipboardList } from "lucide-react";

export const AdminNewSideNavItems = [
  { title: "User", path: `${userPrefix}/users`, icon: LayoutDashboard },
  { title: "Reports", path: `${userPrefix}/reports`, icon: ClipboardList }, 
];
