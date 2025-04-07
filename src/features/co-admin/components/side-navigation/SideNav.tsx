import Sidebar from '@/components/layout/side-navigaion/SideNav';
import { SideNavItems } from './side-nav-items';

const SideNavigation = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Sidebar navItems={SideNavItems} setIsSidebarOpen={setIsSidebarOpen} />
  );
};

export default SideNavigation;
