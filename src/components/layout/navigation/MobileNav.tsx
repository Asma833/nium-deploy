import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NavItem } from './navigation.types';

interface MobileNavProps {
  navItems: NavItem[];
  isItemActive: (item: NavItem) => boolean;
  activeDropdownItem: string | null;
  openMobileDropdown: string | null;
  onNavItemClick: (item: NavItem) => void;
  onDropdownItemClick: (parentTitle: string, dropdownTitle: string, path: string) => void;
  toggleMobileDropdown: (title: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  navItems,
  isItemActive,
  activeDropdownItem,
  openMobileDropdown,
  onNavItemClick,
  onDropdownItemClick,
  toggleMobileDropdown,
}) => (
  <div className="md:hidden py-2">
    {navItems.map((item, idx) => (
      <div key={idx} className="px-2 pt-2 pb-3">
        <button
          className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between
            ${isItemActive(item) ? 'text-black bg-gray-50' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
          onClick={() => {
            if (item.dropdown) {
              toggleMobileDropdown(item.title);
            } else {
              onNavItemClick(item);
            }
          }}
        >
          {item.title}
          {item.dropdown && (
            openMobileDropdown === item.title ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {item.dropdown && openMobileDropdown === item.title && (
          <div className="pl-4 mt-2 space-y-1">
            {item.dropdown.map((dropdownItem, dropIdx) => (
              <button
                key={dropIdx}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm
                  ${activeDropdownItem === dropdownItem.title ? 'text-black font-semibold bg-gray-50' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
                onClick={() => onDropdownItemClick(item.title, dropdownItem.title, dropdownItem.path)}
              >
                {dropdownItem.title}
              </button>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);
