import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import Logo from '@/components/logo/Logo';
import { NavigationItem } from '@/core/constant/manageSideNavOptions';

interface SidebarProps {
  navItems: NavigationItem[];
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps & { setIsSidebarOpen: (open: boolean) => void }> = ({
  navItems,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const currentItem = navItems.find((item) => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.title);
    }
  }, [location.pathname, navItems]);

  const handleNavigation = (path: string, itemTitle: string) => {
    setActiveItem(itemTitle);
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside className="bg-[--sidenav-bg] h-screen fixed top-0 left-0 flex flex-col transition-all z-30 w-28">
      {/* Sidebar Logo */}
      <Logo className="invert-in-dark ml-4 mb-1 mt-4" /> {/* Navigation List */}
      <nav className="px-3 mt-8">
        <ul className="space-y-1">
          {navItems.map((item, idx) => (
            <li key={idx} className="list-none">
              <a
                onClick={() => item.path && handleNavigation(item.path, item.title)}
                className={cn(
                  'flex items-center text-center flex-col gap-2 my-2 w-full rounded-md cursor-pointer transition-colors text-[12px] px-2',
                  activeItem === item.title
                    ? 'bg-primary text-white hover:bg-gray-200 hover:text-black'
                    : 'hover:bg-muted/20',
                  item.title.length > 16 ? 'py-1' : 'py-3',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon && <item.icon className="h-5 w-5" />} {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
