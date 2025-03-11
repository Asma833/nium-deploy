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
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div
//         className={`fixed lg:static w-48 transition-transform transform 
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 z-50 h-full`}
//       >
//         <CheckerSideNavigation  setIsSidebarOpen={setIsSidebarOpen}/>
//       </div>

//       {/* Main Content */}
      
//         <main className="flex-1 w-[calc(100%-15rem)] h-screen" > 
//         <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} className="lg:w-[calc(100%-12rem)] w-full"/>
//           <DashboardContentWrapper>{children}</DashboardContentWrapper>
//         </main>
//     </div>
//   );
// };

// export default CheckerLayout;

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
      {/* Sidebar - Fixed on all screens, does not scroll */}
      <div
        className={`fixed lg:static top-0 left-0 w-48 h-full bg-white shadow-md transition-transform transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 z-50`}
      >
        <CheckerSideNavigation setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        className="fixed top-0 w-full lg:left-48 lg:w-[calc(100%-12rem)] h-20vh bg-background shadow-md border-b border-gray-200 z-50"
      />
      

      {/* ✅ Scrollable Content (Excludes Header) */}
      <main className="flex-1 w-[calc(100%-15rem)] h-[calc(100vh-70px)] mt-14 overflow-y-auto  p-2">
      
        <DashboardContentWrapper>{children}</DashboardContentWrapper>
      </main>
     
    </div>
  );
};

export default CheckerLayout;
