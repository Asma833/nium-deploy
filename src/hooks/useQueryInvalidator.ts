import { QueryKey, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';

/**
 * Hook for invalidating multiple queries at once using the correct QueryClient instance.
 */
export const useQueryInvalidator = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidates multiple queries in a single call.
   * @param {QueryKey[]} queryKeys - An array of query keys to invalidate.
   * @param {Object} options - Optional options like `refetchType`, `exact`, etc.
   */
  const invalidateMultipleQueries = async (
    queryKeys: QueryKey[] = [],
    options: Partial<Pick<InvalidateQueryFilters, 'refetchType' | 'exact'>> = {}
  ) => {
    const defaultOptions: Partial<Pick<InvalidateQueryFilters, 'refetchType' | 'exact'>> = {
      refetchType: 'all',
      exact: false,
      ...options,
    };

    const promises = queryKeys.map((queryKey) => {
      return queryClient.invalidateQueries({
        queryKey,
        ...defaultOptions,
      });
    });

    await Promise.all(promises);
  };

  return { invalidateMultipleQueries };
};
