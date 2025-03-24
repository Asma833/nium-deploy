import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import Logo from "@/components/logo/logo";

interface NavItem {
  title: string;
  path?: string;
  icon?: React.ElementType;
  children?: { title: string; path: string; icon?: React.ElementType }[];
}

interface SidebarProps {
  navItems: NavItem[];
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.some((child) => child.path === location.pathname)) {
        setOpenDropdown(item.title); // Keep dropdown open
        setActiveItem(location.pathname); // Highlight only child
      }
    });
  }, [location.pathname, navItems]);

  const handleNavigation = (path: string) => {
    setActiveItem(path);
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
            <li
              key={idx}
              className={cn(
                "list-none",
                openDropdown === item.title ? "bg-gray-100" : "" 
              )}
            >
              {item.children ? (
                <>
                  {/* Parent Dropdown Toggle */}
                  <div
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-3 rounded-md cursor-pointer transition-colors",
                      openDropdown === item.title ? "text-black" : "hover:bg-muted/20"
                    )}
                    onClick={() => setOpenDropdown(openDropdown === item.title ? null : item.title)}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {item.icon && <item.icon className="h-5 w-5" />} {item.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transform transition-transform ${
                        openDropdown === item.title ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Child Menu Items - Light Gray Background */}
                  {openDropdown === item.title && (
                    <ul className="ml-3 bg-gray-100 rounded-md pb-2">
                      {item.children.map((subItem, subIdx) => (
                        <li key={subIdx} className="list-none my-1">
                          <a
                            onClick={() => handleNavigation(subItem.path)}
                            className={cn(
                              "block px-4 py-2 text-sm rounded-md hover:bg-gray-300 cursor-pointer",
                              activeItem === subItem.path ? "bg-primary text-white" : "text-gray-700"
                            )}
                          >
                            {subItem.icon && <subItem.icon className="h-4 w-4 inline mr-2" />} {subItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a
                  onClick={() => item.path && handleNavigation(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 w-full rounded-md cursor-pointer transition-colors text-sm font-medium",
                    activeItem === item.path ? "bg-primary text-white hover:bg-gray-200 hover:text-black" : "hover:bg-muted/20"
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5" />} {item.title}
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
