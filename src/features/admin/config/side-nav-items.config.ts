import { LayoutDashboard, ClipboardList, User, Eye } from 'lucide-react';

const userPrefix = '/admin';
export const SideNavItems = [
  { title: 'N-User', path: `${userPrefix}/users`, icon: LayoutDashboard },
  // Commented the following items as they are not used in the current phase
  // { title: 'Partners', path: `${userPrefix}/partners`, icon: User },
  // { title: 'Reports', path: `${userPrefix}/reports`, icon: ClipboardList },
  { title: 'View All', path: `${userPrefix}/viewall`, icon: Eye },
];
