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
  const handleSidebarToggle = () => {
    if(window.innerWidth < 1023){
      setIsSidebarOpen(!isSidebarOpen);
    }
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed lg:static w-48 transition-transform transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 z-50 h-full`}
      >
        <CheckerSideNavigation />
      </div>

      {/* Main Content */}
      
        <main className="flex-1 w-[calc(100%-15rem)] h-screen" onClick={handleSidebarToggle}> 
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <DashboardContentWrapper>{children}</DashboardContentWrapper>
        </main>
    </div>
  );
};

export default CheckerLayout;

// import { useState } from "react";
// import DashboardContentWrapper from "@/components/common/DashboardContentWrapper";
// import CheckerSideNavigation from "./side-navigation/CheckerSideNav";
// import Header from "@/components/layout/side-navigaion/HeaderNav";
// import { ReactNode } from "react";

// interface CheckerLayoutProps {
//   children: ReactNode;
// }

// const CheckerLayout = ({ children }: CheckerLayoutProps) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-gray-50 relative">
//       {/* Sidebar */}
//       <div
//         className={`absolute md:static left-0 top-0 h-full bg-white transition-transform transform 
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}  md:w-48 md:translate-x-0 z-50 shadow-lg`}
//       >
//         <CheckerSideNavigation />
//       </div>

//       {/* Main Content */}
//       <div className={`flex-1 transition-all ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
//         <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
//         <DashboardContentWrapper>{children}</DashboardContentWrapper>
//       </div>
//     </div>
//   );
// };

// export default CheckerLayout;
