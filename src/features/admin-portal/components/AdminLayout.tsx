import { ReactNode } from "react";
import AdminHeader from "./header/AdminHeader";
import LogoHeader from "@/components/common/LogoHeader";
import DashboardContentWrapper from "@/components/common/DashboardContentWrapper";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center flex-col justify-start">
      <LogoHeader />
      <AdminHeader />
      <DashboardContentWrapper>{children}</DashboardContentWrapper>
    </div>
  );
};

export default AdminLayout;
