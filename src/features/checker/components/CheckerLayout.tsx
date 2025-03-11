import { useState } from "react";
import DashboardContentWrapper from "@/components/common/DashboardContentWrapper";
import CheckerSideNavigation from "./side-navigation/CheckerSideNav";
import Header from "@/components/layout/side-navigaion/HeaderNav";

import { ReactNode } from "react";

interface CheckerLayoutProps {
  children: ReactNode;
}

const CheckerLayout = ({ children }: CheckerLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  

  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed lg:static w-48 transition-transform transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 z-50 h-full`}
      >
        <CheckerSideNavigation  setIsSidebarOpen={setIsSidebarOpen}/>
      </div>

      {/* Main Content */}
      
        <main className="flex-1 w-[calc(100%-15rem)] h-screen" > 
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <DashboardContentWrapper>{children}</DashboardContentWrapper>
        </main>
    </div>
  );
};

export default CheckerLayout;

