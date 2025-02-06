import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Power, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import { defaultNavItems,NavItem } from './NavItems';
import logo from "../../../assets/images/nium-logo.svg"; 



const Header = ({ navItems = defaultNavItems }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [activeDropdownItem, setActiveDropdownItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const isItemActive = (item: NavItem) => {
    if (item.title === activeItem) return true;
    if (item.dropdown && activeDropdownItem) {
      return item.dropdown.some(dropItem => dropItem.title === activeDropdownItem);
    }
    return false;
  };

  const handleDropdownItemClick = (parentTitle: string, dropdownTitle: string, path: string) => {
    setActiveItem(parentTitle);
    setActiveDropdownItem(dropdownTitle);
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    navigate(path); // Use navigate instead of href
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

  const NavLink = ({ item }: { item: NavItem }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
      <div
        className="relative group"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 transition-colors
            ${isItemActive(item)
              ? 'text-black font-semibold' 
              : 'text-gray-500 hover:text-black'
            }`}
          onClick={() => handleNavItemClick(item)}
        >
          {item.title}
          {item.dropdown && (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {item.dropdown && isDropdownOpen && (
          <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-100 z-50">
            <div className="py-2">
              {item.dropdown.map((dropdownItem, idx) => (
                <button
                  key={idx}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50
                    ${activeDropdownItem === dropdownItem.title 
                      ? 'text-black font-semibold bg-gray-50' 
                      : 'text-gray-700'
                    }`}
                  onClick={() => handleDropdownItemClick(item.title, dropdownItem.title, dropdownItem.path)}
                >
                  {dropdownItem.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200">
       {/* <div className="flex items-end h-14">
          <div className="flex items-end">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} className="h-8" />
            </Link>
          </div>
          </div> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="flex items-center justify-between h-16 ">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-500" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, idx) => (
              <NavLink key={idx} item={item} />
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Power className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2">
            {navItems.map((item, idx) => (
              <div key={idx} className="px-2 pt-2 pb-3">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between
                    ${isItemActive(item)
                      ? 'text-black bg-gray-50' 
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  onClick={() => {
                    if (item.dropdown) {
                      toggleMobileDropdown(item.title);
                    } else {
                      handleNavItemClick(item);
                    }
                  }}
                >
                  {item.title}
                  {item.dropdown && (
                    openMobileDropdown === item.title 
                      ? <ChevronUp className="w-5 h-5" />
                      : <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {item.dropdown && openMobileDropdown === item.title && (
                  <div className="pl-4 mt-2 space-y-1">
                    {item.dropdown.map((dropdownItem, dropIdx) => (
                      <button
                        key={dropIdx}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm
                          ${activeDropdownItem === dropdownItem.title 
                            ? 'text-black font-semibold bg-gray-50' 
                            : 'text-gray-500 hover:text-black hover:bg-gray-50'
                          }`}
                        onClick={() => handleDropdownItemClick(item.title, dropdownItem.title, dropdownItem.path)}
                      >
                        {dropdownItem.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;