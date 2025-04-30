import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { toast } from 'sonner';
import axios from 'axios';
import { useCurrentUser } from '@/utils/getUserFromRedux';

type TransactionType = 'all' | 'completed';

export const useGetAllOrders = <T = any,>(
  initialTransactionType: TransactionType = 'all',
  autoFetch: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(
    initialTransactionType
  );

  // Get the current user once
  const { user } = useCurrentUser();
  const userHashedKey = user?.hashed_key;

  // Use a ref to store the latest transaction type to avoid dependencies
  const transactionTypeRef = useRef(transactionType);
  transactionTypeRef.current = transactionType;

  // Function to fetch data with GET request
  const fetchData = useCallback(async () => {
    if (!userHashedKey) {
      setError('User hash key not available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get(API.ORDERS.LIST);

      setData(data);
    } catch (err) {
      // More detailed error logging for authentication issues
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.log('Unauthorized');
      }

      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error('Error Fetching Checker Orders', {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userHashedKey]);

  // fetch data again
  const changeTransactionType = useCallback((newType: TransactionType) => {
    return () => {
      setTransactionType(newType);
    };
  }, []);

  // Watch for transaction type changes to trigger a new fetch
  useEffect(() => {
    if (loading) return; // Prevent double fetching when autoFetch is true
    fetchData();
  }, [transactionType, fetchData]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    fetchData,
    transactionType,
  };
};

export default useGetAllOrders;
