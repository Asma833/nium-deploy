import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { useCurrentUser } from '@/utils/getUserFromRedux';

type TransactionType = 'all' | 'completed';

// Query key factory for consistent caching
export const getAllOrdersQueryKey = (transactionType: TransactionType, userHashedKey?: string) => {
  return ['orders', 'all', transactionType, userHashedKey].filter(Boolean);
};

// Fetch function for TanStack Query
const fetchAllOrders = async (transactionType: TransactionType, userHashedKey: string) => {
  const endpoint = transactionType === 'all' ? API.ORDERS.LIST : `${API.ORDERS.LIST}?type=${transactionType}`;

  const { data } = await axiosInstance.get(endpoint);
  return data.data;
};

export const useGetAllOrders = (initialTransactionType: TransactionType = 'all', autoFetch: boolean = true) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(initialTransactionType);

  // Get the current user
  const { user } = useCurrentUser();
  const userHashedKey = user?.hashed_key;

  // Generate query key for this hook instance
  const queryKey = getAllOrdersQueryKey(transactionType, userHashedKey);

  // Use TanStack Query
  const {
    data = {},
    isLoading: loading,
    error: queryError,
    refetch: fetchData,
  } = useQuery({
    queryKey,
    queryFn: () => {
      if (!userHashedKey) {
        throw new Error('User hash key not available');
      }
      return fetchAllOrders(transactionType, userHashedKey);
    },
    enabled: autoFetch && !!userHashedKey,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (queryError) {
      // More detailed error logging for authentication issues
      if (axios.isAxiosError(queryError) && queryError.response?.status === 401) {
        console.error('Unauthorized');
      }

      const errorMessage = queryError instanceof Error ? queryError.message : 'An unknown error occurred';
      toast.error('Error Fetching Checker Orders', {
        description: errorMessage,
      });
    }
  }, [queryError]);

  // Convert TanStack Query error to string for compatibility
  const error = queryError ? (queryError instanceof Error ? queryError.message : 'An unknown error occurred') : null;

  return {
    data,
    loading,
    error,
    fetchData,
    transactionType,
    setTransactionType,
    queryKey,
  };
};

export default useGetAllOrders;
