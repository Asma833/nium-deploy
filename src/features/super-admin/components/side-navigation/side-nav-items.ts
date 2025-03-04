
const userPrefix = "/admin";

import { LayoutDashboard, ClipboardList } from "lucide-react";

export const SideNavItems = [
  { title: "User", path: `${userPrefix}/users`, icon: LayoutDashboard },
  { title: "Reports", path: `${userPrefix}/reports`, icon: ClipboardList }, 
];
