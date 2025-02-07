import { ReactNode } from "react";
import AdminHeader from "./header/AdminHeader";
import LogoHeader from "@/components/common/LogoHeader";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center flex-col justify-start">
        <LogoHeader />
      <AdminHeader />
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout;
