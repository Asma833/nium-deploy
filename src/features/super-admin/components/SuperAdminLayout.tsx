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
 const handleSidebarToggle = () => {
  if(window.innerWidth < 768){
    setIsSidebarOpen(!isSidebarOpen);
  }
 }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`w-48 transition-transform transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 fixed md:static h-full`}
      >
        <SideNavigation />
      </div>

      {/* Main Content */}
      
        <main className="flex-1 w-[calc(100%-15rem)] h-screen" onClick={handleSidebarToggle}> 
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <DashboardContentWrapper>{children}</DashboardContentWrapper>
        </main>
    </div>
  );
};

export default SuperAdminLayout;
