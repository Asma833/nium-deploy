import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Power, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { HeaderProps } from '../../types/navigation.types';
import { MobileNav } from './MobileNav';
import LogoutWrapper from '@/features/auth/components/LogoutWrapper';
import { useActiveMenu } from '@/hooks/useActiveMenu';

const Header: React.FC<HeaderProps> = ({ navItems }) => {
  const navigate = useNavigate();
  const { activeItem, setActiveItem, activeDropdownItem, setActiveDropdownItem } = useActiveMenu(navItems);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string, itemTitle: string, dropdownTitle?: string) => {
    setActiveItem(itemTitle);
    setActiveDropdownItem(dropdownTitle || null);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-background border-b border-t border-border w-full h-[70px] sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-muted-foreground" />
          </button>

          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item, idx) => (
                  <NavigationMenuItem key={idx}>
                    {item.dropdown ? (
                      <>
                        <NavigationMenuTrigger className={cn(activeItem === item.title && 'text-primary')}>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1">
                            {item.dropdown.map((dropItem, dropIdx) => (
                              <li key={dropIdx}>
                                <NavigationMenuLink
                                  className={cn(
                                    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground  focus:text-accent-foreground',
                                    activeDropdownItem === dropItem.title && 'bg-accent'
                                  )}
                                  onClick={() => handleNavigation(dropItem.path, item.title, dropItem.title)}
                                >
                                  <div className="text-sm font-medium leading-none">{dropItem.title}</div>
                                  {dropItem.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {dropItem.description}
                                    </p>
                                  )}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        className={cn(navigationMenuTriggerStyle(), activeItem === item.title && 'text-primary')}
                        onClick={() => item.path && handleNavigation(item.path, item.title)}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
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

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNav
                navItems={navItems}
                activeItem={activeItem}
                activeDropdownItem={activeDropdownItem}
                onNavigation={handleNavigation}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;
