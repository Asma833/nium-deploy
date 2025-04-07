export interface DropdownItem {
  title: string;
  path: string;
  description?: string;
}

export interface NavItem {
  title: string;
  path?: string;
  dropdown?: DropdownItem[];
}

export interface NavLinkProps {
  item: NavItem;
  isItemActive: (item: NavItem) => boolean;
  activeDropdownItem: string | null;
  onNavItemClick: (item: NavItem) => void;
  onDropdownItemClick: (
    parentTitle: string,
    dropdownTitle: string,
    path: string
  ) => void;
}

export interface MobileNavProps {
  navItems: NavItem[];
  activeItem: string;
  activeDropdownItem: string | null;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onNavigation: (
    path: string,
    itemTitle: string,
    dropdownTitle?: string
  ) => void;
}

export interface HeaderProps {
  navItems: NavItem[];
}
