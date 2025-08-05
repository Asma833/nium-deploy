import { SideNavOptions, getNavigationItemsByRole } from '@/core/constant/manageSideNavOptions';

// Legacy export for backward compatibility (deprecated - use SideNavOptions.checker instead)
export const SideNavItems = SideNavOptions.maker;

// Recommended approach: Use the centralized navigation management
export { SideNavOptions, getNavigationItemsByRole };
