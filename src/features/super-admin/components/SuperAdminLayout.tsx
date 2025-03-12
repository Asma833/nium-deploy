import { useState } from "react";
import DashboardContentWrapper from "@/components/common/DashboardContentWrapper";
import Header from "@/components/layout/side-navigaion/HeaderNav";
import { ReactNode } from "react";
import SideNavigation from "./side-navigation/SideNav";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  return (
    <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar - Fixed on all screens, does not scroll */}
    <div
      className={`fixed lg:static top-0 left-0 w-48 h-full bg-white shadow-md transition-transform transform 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 z-50`}
    >
        <SideNavigation setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        className="fixed top-0 w-full lg:left-48 lg:w-[calc(100%-12rem)] bg-background shadow-md"
      />
      
      {/* Scrollable Content (Excludes Header) */}
      <main className="flex-1 w-[calc(100%-15rem)] h-[calc(100vh-70px)] mt-14 overflow-y-auto" onClick={()=>{setIsSidebarOpen(false)}}>
          <DashboardContentWrapper>{children}</DashboardContentWrapper>
        </main>
    </div>
  );
};

export default SuperAdminLayout;
