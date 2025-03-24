
const userPrefix = "/admin";

import { LayoutDashboard, ClipboardList, Eye } from "lucide-react";

export const SideNavItems = [
  { title: "N-User", path: `${userPrefix}/users`, icon: LayoutDashboard },
  { title: "Reports", path: `${userPrefix}/reports`, icon: ClipboardList }, 
  { title: "View All", path: `${userPrefix}/viewall`, icon: Eye }, 
];
