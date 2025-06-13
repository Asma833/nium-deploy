import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { Order, TransactionType, TransactionTypeEnum } from '../types/updateIncident.types';

export const useGetCheckerOrders = (
  initialTransactionType: TransactionType = TransactionTypeEnum.ALL,
  autoFetch: boolean = true
) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(initialTransactionType);

  const { getUserHashedKey } = useCurrentUser();
  const hashCheckerId = getUserHashedKey();

  // Define query key
  const queryKey = ['checkerOrders', transactionType];
  // Use TanStack Query for data fetching
  const {
    data,
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.post(API.ORDERS.CHECKER_ORDERS, {
        transaction_type: transactionType,
      });

      return data as Order;
    },
    enabled: autoFetch && !!hashCheckerId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  // Function to manually trigger a refetch
  const fetchData = useCallback(() => {
    if (!hashCheckerId) {
      toast.error('Error Fetching Checker Orders', {
        description: 'User hash key not available',
      });
      return;
    }

    refetch();
  }, [hashCheckerId, refetch]);

  // fetch data again
  const changeTransactionType = useCallback((newType: TransactionType) => {
    return () => {
      setTransactionType(newType);
    };
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    transactionType,
    getAllTransactions: changeTransactionType(TransactionTypeEnum.ALL),
    getCompletedTransactions: changeTransactionType(TransactionTypeEnum.COMPLETED),
    getPendingTransactions: changeTransactionType(TransactionTypeEnum.PENDING),
  };
};

export default useGetCheckerOrders;
