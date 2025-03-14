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

const Sidebar: React.FC<SidebarProps & { setIsSidebarOpen: (open: boolean) => void }> = ({ navItems, setIsSidebarOpen }) => {
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
    <aside className="bg-background h-screen shadow-lg fixed top-0 left-0 flex flex-col transition-all z-30 w-48">
      {/* Sidebar Logo */}
      <Logo className="invert-in-dark ml-4 mb-1 mt-4" />

      {/* Navigation List */}
      <nav className="px-3">
        <ul className="space-y-1">
          {navItems.map((item, idx) => (
            <li key={idx} className="list-none">
              {item.dropdown ? (
                <>
                  {/* Dropdown Toggle */}
                  <div
                    className={cn(
                     "flex items-center justify-between w-full pl-5 py-3 my-2 rounded-md cursor-pointer transition-colors",
                 openDropdown === item.title ? "bg-black text-white" : "hover:bg-muted/20",
                  openDropdown === item.title && "hover:bg-gray-200 hover:text-black"
                )}
                    onClick={() => setOpenDropdown(openDropdown === item.title ? null : item.title)}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.title}
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${openDropdown === item.title ? "rotate-180" : ""}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === item.title && (
                    <ul className="ml-6 space-y-1">
                      {item.dropdown.map((subItem, subIdx) => (
                        <li key={subIdx} className="list-none">
                          <a
                            onClick={() => handleNavigation(subItem.path, subItem.title)}
                            className={cn("block pl-5 py-2 text-sm rounded-md hover:bg-muted/20 cursor-pointer",item.title.length > 16 ? "py-1" : "py-3")}
                          >
                            {subItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a
                  onClick={() => item.path && handleNavigation(item.path, item.title)}
                  className={cn(
                   "flex items-center gap-2 pl-2 my-2 w-full rounded-md cursor-pointer transition-colors text-sm",
                   activeItem === item.title ? "bg-primary text-white hover:bg-gray-200 hover:text-black" : "hover:bg-muted/20"
                 ,item.title.length > 16 ? "py-1" : "py-3")}
                >
                  {item.icon && <item.icon className="h-5 w-5"/>} {item.title}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

