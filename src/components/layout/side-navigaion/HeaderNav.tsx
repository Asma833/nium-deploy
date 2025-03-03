import React from "react";
import { Menu,Bell,Power } from "lucide-react";
import LogoutWrapper from "@/features/auth/components/LogoutWrapper";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import BreadCrumb from "@/components/common/BreadCrumb";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <nav className="bg-background shadow-lg h-[70px] top-0 rounded-md m-2">
      <div className="sm:px-6 lg:px-8 flex items-center h-16">
        
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted/20"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '' : <Menu className="w-6 h-6 text-muted-foreground" />}
        </button>

        {/* Spacer to push icons to the right */}
        <div className="flex-1">
        <div className="block lg:hidden">
        <BreadCrumb />
      </div>
                  
        </div>

        {/* Notification and Logout Buttons (Right) */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-muted/20">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <LogoutWrapper>
            <button className="p-2 rounded-full hover:bg-muted/20">
              <Power className="w-5 h-5 text-muted-foreground" />
            </button>
          </LogoutWrapper>
        </div>
      </div>
    </nav>
  );
};

export default Header;
