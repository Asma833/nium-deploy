import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavItem } from '@/components/layout/navigation/navigation.types';

export const useActiveMenu = (navItems: NavItem[]) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>('');
  const [activeDropdownItem, setActiveDropdownItem] = useState<string | null>(null);

  const findActiveItems = (path: string) => {
    for (const item of navItems) {
      if (item.path === path) {
        return { main: item.title, dropdown: null };
      }
      if (item.dropdown) {
        const dropdownItem = item.dropdown.find(d => d.path === path);
        if (dropdownItem) {
          return { main: item.title, dropdown: dropdownItem.title };
        }
      }
    }
    return { main: '', dropdown: null };
  };

  useEffect(() => {
    const { main, dropdown } = findActiveItems(location.pathname);
    setActiveItem(main);
    setActiveDropdownItem(dropdown);
  }, [location.pathname]);

  return {
    activeItem,
    setActiveItem,
    activeDropdownItem,
    setActiveDropdownItem
  };
};
