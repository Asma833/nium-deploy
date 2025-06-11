import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLinkProps } from '../../types/navigation.types';

export const NavLink: React.FC<NavLinkProps> = ({
  item,
  isItemActive,
  activeDropdownItem,
  onNavItemClick,
  onDropdownItemClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <button
        className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 transition-colors
          ${isItemActive(item) ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => onNavItemClick(item)}
      >
        {item.title}
        {item.dropdown && <ChevronDown className="w-4 h-4" />}
      </button>

      {item.dropdown && isDropdownOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-background rounded-md shadow-lg border border-border z-50">
          <div className="py-2">
            {item.dropdown.map((dropdownItem, idx) => (
              <button
                key={idx}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted/20
                  ${
                    activeDropdownItem === dropdownItem.title
                      ? 'text-foreground font-semibold bg-muted/10'
                      : 'text-muted-foreground'
                  }`}
                onClick={() => onDropdownItemClick(item.title, dropdownItem.title, dropdownItem.path)}
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
