import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Power, Menu } from "lucide-react";
import { NavItem } from "./navigation.types";
import { NavLink } from "./NavLink";
import { MobileNav } from "./MobileNav";
import LogoutWrapper from "@/features/auth/components/LogoutWrapper";

interface HeaderProps {
  navItems: NavItem[];
}

const Header: React.FC<HeaderProps> = ({ navItems }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [activeDropdownItem, setActiveDropdownItem] = useState<string | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );

  const isItemActive = (item: NavItem) => {
    if (item.title === activeItem) return true;
    if (item.dropdown && activeDropdownItem) {
      return item.dropdown.some(
        (dropItem) => dropItem.title === activeDropdownItem
      );
    }
    return false;
  };

  const handleDropdownItemClick = (
    parentTitle: string,
    dropdownTitle: string,
    path: string
  ) => {
    setActiveItem(parentTitle);
    setActiveDropdownItem(dropdownTitle);
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    navigate(path);
  };

  const handleNavItemClick = (item: NavItem) => {
    setActiveItem(item.title);
    if (!item.dropdown && item.path) {
      setActiveDropdownItem(null);
      setIsMobileMenuOpen(false);
      navigate(item.path);
    }
  };

  const toggleMobileDropdown = (title: string) => {
    setOpenMobileDropdown(openMobileDropdown === title ? null : title);
  };

  return (
    <nav className="bg-background border-b border-t border-border w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-muted-foreground" />
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                item={item}
                isItemActive={isItemActive}
                activeDropdownItem={activeDropdownItem}
                onNavItemClick={handleNavItemClick}
                onDropdownItemClick={handleDropdownItemClick}
              />
            ))}
          </div>

          <div className="flex items-center space-x-4">
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

        {isMobileMenuOpen && (
          <MobileNav
            navItems={navItems}
            isItemActive={isItemActive}
            activeDropdownItem={activeDropdownItem}
            openMobileDropdown={openMobileDropdown}
            onNavItemClick={handleNavItemClick}
            onDropdownItemClick={handleDropdownItemClick}
            toggleMobileDropdown={toggleMobileDropdown}
          />
        )}
      </div>
    </nav>
  );
};

export default Header;
