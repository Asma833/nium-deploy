import Sidebar from '@/components/layout/side-navigaion/SideNav';
import { CheckerSideNavItems } from './checker-side-nav-items';

const CheckerSideNavigation = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Sidebar
      navItems={CheckerSideNavItems}
      setIsSidebarOpen={setIsSidebarOpen}
    />
  );
};

export default CheckerSideNavigation;
