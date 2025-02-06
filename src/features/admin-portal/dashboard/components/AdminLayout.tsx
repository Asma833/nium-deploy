import { ReactNode } from "react";
import AdminHeader from "./header/AdminHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/logo/logo";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center flex-col justify-start">
      <div className="w-full flex justify-between items-center p-4">
        <ThemeToggle />
        <div className="flex justify-center">
          <Logo />
        </div>
      </div>
      <AdminHeader />
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout;
