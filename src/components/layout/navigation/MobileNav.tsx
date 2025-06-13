import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { MobileNavProps } from '../../types/navigation.types';

export const MobileNav: React.FC<MobileNavProps> = ({
  navItems,
  activeItem,
  activeDropdownItem,
  onNavigation,
  setIsMobileMenuOpen,
}) => {
  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      className="fixed left-0 top-0 h-full w-[280px] pt-5 z-50 md:hidden overflow-hidden bg-background border-r shadow-lg"
    >
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="h-full overflow-y-auto pb-20"
      >
        <div className="top-actions flex items-end justify-end px-4">
          <span className="w-6 h-6 text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
            Close
          </span>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {navItems.map((item, idx) =>
            item.dropdown ? (
              <AccordionItem key={idx} value={item.title}>
                <AccordionTrigger className={cn('px-6 py-2', activeItem === item.title && 'text-primary font-medium')}>
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2 px-4">
                    {item.dropdown.map((dropItem, dropIdx) => (
                      <Button
                        key={dropIdx}
                        variant="ghost"
                        className={cn(
                          'justify-start px-2',
                          activeDropdownItem === dropItem.title && 'text-primary font-medium bg-accent'
                        )}
                        onClick={() => onNavigation(dropItem.path, item.title, dropItem.title)}
                      >
                        {dropItem.title}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Button
                key={idx}
                variant="ghost"
                className={cn(
                  'w-full justify-start px-6 py-2',
                  activeItem === item.title && 'text-primary font-medium'
                )}
                onClick={() => item.path && onNavigation(item.path, item.title)}
              >
                {item.title}
              </Button>
            )
          )}
        </Accordion>
      </motion.div>
    </motion.div>
  );
};
