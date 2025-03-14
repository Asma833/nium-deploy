import React from "react";
import { Menu, Bell, Power } from "lucide-react";
import LogoutWrapper from "@/features/auth/components/LogoutWrapper";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { usePageTitle } from "@/components/common/PageTitle";
import { cn } from "@/utils/cn";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  className:string;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen,className }) => {
  const { title } = usePageTitle();
  return (
    <nav className={cn(`bg-background fixed top-0 right-0 border-b border-gray-200 h-[70px]  z-40`,className)}>
      <div className="sm:px-6 lg:px-8 flex items-center h-16">
        <button
          className="lg:hidden p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
           ""
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        


        {/* Spacer to push icons to the right */}
        <div className="flex-1">
        <div className="block">
        <h1 className="text-2xl font-bold">{title}</h1>
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
