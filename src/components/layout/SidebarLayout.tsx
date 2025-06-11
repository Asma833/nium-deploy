import { useState } from 'react';
import DashboardContentWrapper from '@/components/common/DashboardContentWrapper';
import Header from '@/components/layout/side-navigaion/HeaderNav';
import Sidebar from '@/components/layout/side-navigaion/SideNav';
import { ReactNode } from 'react';
import { getNavigationItemsByRole } from '@/core/constant/manageSideNavOptions';
import { useCurrentUser } from '@/utils/getUserFromRedux';

interface CheckerLayoutProps {
  children: ReactNode;
}

const SidebarLayout = ({ children }: CheckerLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { getUserRole } = useCurrentUser();

  // Get navigation items based on user role
  const userRole = getUserRole() || '';
  const navigationItems = getNavigationItemsByRole(userRole);

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={`fixed lg:static top-0 left-0 w-28 h-full bg-white shadow-md transition-transform transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} lg:translate-x-0 z-50`}
      >
        {' '}
        <Sidebar navItems={navigationItems} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        className="fixed top-0 w-full lg:left-28 lg:w-[calc(100%-7rem)]  bg-secondary"
      />
      <main
        className="flex-1 w-[calc(100%-15rem)] h-[calc(100vh-70px)] mt-[70px] overflow-y-auto"
        onClick={() => {
          setIsSidebarOpen(false);
        }}
      >
        <DashboardContentWrapper>{children}</DashboardContentWrapper>
      </main>
    </div>
  );
};

export default SidebarLayout;
