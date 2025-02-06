export interface DropdownItem {
  title: string;
  path: string;
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
  onDropdownItemClick: (parentTitle: string, dropdownTitle: string, path: string) => void;
}
