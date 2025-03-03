import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import Logo from "@/components/logo/logo";

interface SidebarProps {
  navItems: NavItem[];
}

interface NavItem {
  title: string;
  path?: string;
  icon?: React.ElementType;
  dropdown?: { title: string; path: string }[];
}



const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Set active item based on the current route on mount
  useEffect(() => {
    const currentItem = navItems.find((item) => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.title);
    }
  }, [location.pathname, navItems]); // Runs when route changes

  const handleNavigation = (path: string, itemTitle: string) => {
    setActiveItem(itemTitle);
    navigate(path);
  };

  return (
    <aside className="bg-background h-screen shadow-lg fixed top-0 left-0 flex flex-col transition-all z-30 w-48">
      {/* Sidebar Logo */}
      <Logo className="invert-in-dark mx-auto my-3" />

      {/* Navigation List */}
      <nav className="space-y-1 px-3">
        {navItems.map((item, idx) => (
          <div key={idx}>
            {item.dropdown ? (
              <button
                className={cn(
                  "flex items-center justify-between w-full pl-5 py-3 rounded-md hover:bg-muted/20 text-left",
                  activeItem === item.title && "bg-primary text-white"
                )}
                onClick={() => setOpenDropdown(openDropdown === item.title ? null : item.title)}
              >
                <span className="flex items-center gap-2 text-left text-sm"><b>{item.icon && <item.icon />}</b> {item.title}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : (
              <button
                className={cn(
                  "flex items-center gap-2 pl-5 py-3 w-full rounded-md hover:bg-muted/20 text-left text-sm",
                  activeItem === item.title && "bg-primary text-white"
                )}
                onClick={() => item.path && handleNavigation(item.path, item.title)}
              >
               <b>{item.icon && <item.icon />}</b> {item.title}
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
