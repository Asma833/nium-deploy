import { LayoutDashboard, ClipboardList, FileEdit, Eye, CreditCard, User } from 'lucide-react';
import { ROUTES, getNavPath } from './routePaths';

// Navigation item type definition
export interface NavigationItem {
  title: string;
  path: string;
  icon?: any;
  disabled?: boolean;
}

// User role navigation configurations
export const SideNavOptions = {
  admin: [
    {
      title: 'N-User',
      path: getNavPath('ADMIN', ROUTES.ADMIN.NUSER),
      icon: LayoutDashboard,
    },
    // Commented the following items as they are not used in the current phase
    // {
    //   title: 'Partners',
    //   path: getNavPath('ADMIN', ROUTES.ADMIN.PARTNER),
    //   icon: User,
    //   disabled: true,
    // },
    // {
    //   title: 'Reports',
    //   path: '/admin/reports',
    //   icon: ClipboardList,
    //   disabled: true,
    // },
    {
      title: 'View All',
      path: getNavPath('ADMIN', ROUTES.ADMIN.VIEWALL),
      icon: Eye,
    },
  ] as NavigationItem[],
  checker: [
    // Disabling the dashboard for now
    // {
    //   title: 'Dashboard',
    //   path: getNavPath('CHECKER', ROUTES.CHECKER.DASHBOARD),
    //   icon: LayoutDashboard,
    //   disabled: true,
    // },
    {
      title: 'View All',
      path: getNavPath('CHECKER', ROUTES.CHECKER.VIEWALL),
      icon: Eye,
    },
    {
      title: 'Assign',
      path: getNavPath('CHECKER', ROUTES.CHECKER.ASSIGN),
      icon: ClipboardList,
    },
    {
      title: 'Update Incident',
      path: getNavPath('CHECKER', ROUTES.CHECKER.UPDATE_INCIDENT),
      icon: FileEdit,
    },
    {
      title: 'Completed Transactions',
      path: getNavPath('CHECKER', ROUTES.CHECKER.COMPLETEDTRANSACTIONS),
      icon: CreditCard,
    },
  ] as NavigationItem[],
  maker: [
    {
      title: 'Create Transaction',
      path: getNavPath('MAKER', ROUTES.MAKER.CREATE_TRANSACTION),
      icon: ClipboardList,
    },
    {
      title: 'View Status',
      path: getNavPath('MAKER', ROUTES.MAKER.VIEW_STATUS),
      icon: Eye,
    },
  ] as NavigationItem[],
};

// Helper function to get navigation items by role
export const getNavigationItemsByRole = (role: string): NavigationItem[] => {
  const normalizedRole = role.toLowerCase();
  return SideNavOptions[normalizedRole as keyof typeof SideNavOptions] || [];
};
