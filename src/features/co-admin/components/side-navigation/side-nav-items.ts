
const userPrefix = "/admin";

import { LayoutDashboard, ClipboardList, User, Folder } from "lucide-react";

export const SideNavItems = [
  {
    title: 'User', // Parent item
    path: '#', // This will not navigate directly, just for the toggle
    icon: LayoutDashboard,
    children: [
      { title: 'N-User', path: `${userPrefix}/users`, icon: User },
      { title: 'Partners', path: `${userPrefix}/parners`, icon: Folder }
    ]
  },
  // { title: "N-User", path: `${userPrefix}/users`, icon: LayoutDashboard },
  { title: "Reports", path: `${userPrefix}/reports`, icon: ClipboardList }, 
];
