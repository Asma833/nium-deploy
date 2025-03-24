
const userPrefix = "/admin";

import { LayoutDashboard, ClipboardList, User, Folder } from "lucide-react";

export const SideNavItems = [
  { title: "N-User", path: `${userPrefix}/users`, icon: LayoutDashboard },
  { title: "Partners", path: `${userPrefix}/partners`, icon: User },
  { title: "Reports", path: `${userPrefix}/reports`, icon: ClipboardList }, 
];
