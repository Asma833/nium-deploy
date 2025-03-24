import { useState } from "react";
import DashboardContentWrapper from "@/components/common/DashboardContentWrapper";
import CheckerSideNavigation from "./side-navigation/CheckerSideNav";
import Header from "@/components/layout/side-navigaion/HeaderNav";
import { ReactNode } from "react";
import PageTitle from "@/components/layout/titles/PageTitle";

interface CheckerLayoutProps {
  children: ReactNode;
}

const CheckerLayout = ({ children }: CheckerLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={`fixed lg:static top-0 left-0 w-28 h-full bg-white shadow-md transition-transform transform 
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 z-50`}
      >
        <CheckerSideNavigation setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        className="fixed top-0 w-full lg:left-28 lg:w-[calc(100%-7rem)]  bg-background shadow-md"
      />
      <main
        className="flex-1 w-[calc(100%-15rem)] h-[calc(100vh-70px)] mt-14 overflow-y-auto"
        onClick={() => {
          setIsSidebarOpen(false);
        }}
      >
        <DashboardContentWrapper>
          <PageTitle />
          {children}
        </DashboardContentWrapper>
      </main>
    </div>
  );
};

export default CheckerLayout;
