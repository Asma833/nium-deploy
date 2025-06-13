import { SideNavOptions, getNavigationItemsByRole } from '@/core/constant/manageSideNavOptions';

// Legacy export for backward compatibility (deprecated - use SideNavOptions.admin instead)
export const SideNavItems = SideNavOptions.admin;

// Recommended approach: Use the centralized navigation management
export { SideNavOptions, getNavigationItemsByRole };
