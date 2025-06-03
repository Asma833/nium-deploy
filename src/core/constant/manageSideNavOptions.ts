import {
  LayoutDashboard,
  ClipboardList,
  FileEdit,
  Eye,
  CreditCard,
  User,
} from 'lucide-react';

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
      path: '/admin/users',
      icon: LayoutDashboard,
    },
    // Commented the following items as they are not used in the current phase
    // {
    //   title: 'Partners',
    //   path: '/admin/partners',
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
      path: '/admin/viewall',
      icon: Eye,
    },
  ] as NavigationItem[],

  checker: [
    // Disabling the dashboard for now
    // {
    //   title: 'Dashboard',
    //   path: '/checker/dashboard',
    //   icon: LayoutDashboard,
    //   disabled: true,
    // },
    {
      title: 'View All',
      path: '/checker/viewall',
      icon: Eye,
    },
    {
      title: 'Assign',
      path: '/checker/assign',
      icon: ClipboardList,
    },
    {
      title: 'Update Incident',
      path: '/checker/update-incident',
      icon: FileEdit,
    },
    {
      title: 'Completed Transactions',
      path: '/checker/completed-transactions',
      icon: CreditCard,
    },
  ] as NavigationItem[],

  maker: [
    {
      title: 'View All',
      path: '/checker/viewall',
      icon: Eye,
    },
  ] as NavigationItem[],
};

// Helper function to get navigation items by role
export const getNavigationItemsByRole = (role: string): NavigationItem[] => {
  const normalizedRole = role.toLowerCase();
  return SideNavOptions[normalizedRole as keyof typeof SideNavOptions] || [];
};
