
import Sidebar from "@/components/layout/side-navigaion/SideNav";
import { AdminNewSideNavItems } from "./admin-side-nav-items";

const AdminSideNavigation = () => {
  return <Sidebar navItems={AdminNewSideNavItems}  />;
};

export default AdminSideNavigation;
