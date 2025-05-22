import React from 'react';
import { Menu, Bell, Power } from 'lucide-react';
import LogoutWrapper from '@/features/auth/components/LogoutWrapper';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@/utils/cn';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  className,
}) => {
  return (
    <nav
      className={cn(
        `bg-secondary fixed top-0 right-0 h-[70px] z-40`,
        className
      )}
    >
      <div className="sm:px-6 lg:px-6 flex items-center h-16">
        <button
          className="lg:hidden p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '' : <Menu className="w-6 h-6" />}
        </button>

        {/* Notification and Logout Buttons (Right) */}
        <div className="flex items-center space-x-4 ml-auto">
          <ThemeToggle />
          <LogoutWrapper>
            <button className="p-2 rounded-full hover:bg-muted/20">
              <Power className="w-5 h-5 text-foreground" />
            </button>
          </LogoutWrapper>
        </div>
      </div>
    </nav>
  );
};

export default Header;
