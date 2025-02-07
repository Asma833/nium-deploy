import Header from "@/components/layout/navigation/Header";
import { AdminNavItems } from "./manage-admin-header";

const AdminHeader = () => {
  return <Header navItems={AdminNavItems} />;
};

export default AdminHeader;
