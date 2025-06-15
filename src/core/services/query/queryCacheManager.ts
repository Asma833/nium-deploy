import { QueryClient } from '@tanstack/react-query';

// Global query client reference for cache management
let globalQueryClient: QueryClient | null = null;

/**
 * Set the global query client instance
 * This should be called once when the app initializes
 */
export const setGlobalQueryClient = (queryClient: QueryClient): void => {
  globalQueryClient = queryClient;
};

/**
 * Clear all query cache globally
 * This is used during logout to prevent data leakage between users
 */
export const clearAllQueryCache = async (): Promise<void> => {
  if (globalQueryClient) {
    await globalQueryClient.clear();
    console.log('Query cache cleared for user logout');
  } else {
    console.warn('Global query client not available for cache clearing');
  }
};

/**
 * Invalidate user-specific queries
 * This can be used to clear specific user data
 */
export const invalidateUserQueries = async (): Promise<void> => {
  if (globalQueryClient) {
    // Clear common user-specific query patterns
    await Promise.all([
      globalQueryClient.invalidateQueries({ queryKey: ['checkerOrders'] }),
      globalQueryClient.invalidateQueries({ queryKey: ['checkerOrdersByPartnerId'] }),
      globalQueryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] }),
      globalQueryClient.invalidateQueries({ queryKey: ['getAssignList'] }),
      globalQueryClient.invalidateQueries({ queryKey: ['transactions'] }),
      globalQueryClient.invalidateQueries({ queryKey: ['orders'] }),
      globalQueryClient.invalidateQueries({ queryKey: ['user'] }),
      globalQueryClient.invalidateQueries({ queryKey: ['userStatusUpdate'] }),
    ]);
    console.log('User-specific queries invalidated');
  }
};
