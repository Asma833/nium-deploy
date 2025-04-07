import { useQueryClient } from '@tanstack/react-query';

// Predefined query keys for reusability
export const QUERY_KEYS = {
  ASSIGN_LIST: ['getAssignList'],
  // Add more query keys as needed
} as const;

export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async (queryKeys: string[]) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys });
  };

  return { invalidateQueries };
};
