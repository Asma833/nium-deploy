import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { useCurrentUser } from '@/utils/getUserFromRedux';

type TransactionType = 'all' | 'completed';

export const useGetAllOrders = (initialTransactionType: TransactionType = 'all', autoFetch: boolean = true) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(initialTransactionType);

  // Get the current user once
  const { user } = useCurrentUser();
  const userHashedKey = user?.hashed_key;

  // Use a ref to store the latest transaction type to avoid dependencies
  const transactionTypeRef = useRef(transactionType);
  transactionTypeRef.current = transactionType;

  // Track if initial fetch has happened to prevent double fetching
  const initialFetchDone = useRef(false);

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
      const endpoint =
        transactionTypeRef.current === 'all'
          ? API.ORDERS.LIST
          : `${API.ORDERS.LIST}?type=${transactionTypeRef.current}`;

      const { data } = await axiosInstance.get(endpoint);
      const apiData = data.data;

      setData(apiData);
    } catch (err) {
      // More detailed error logging for authentication issues
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.error('Unauthorized');
      }

      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error('Error Fetching Checker Orders', {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userHashedKey]);

  // Watch for transaction type changes to trigger a new fetch
  useEffect(() => {
    if (loading || !initialFetchDone.current) return; // Prevent double fetching when autoFetch is true
    fetchData();
  }, [transactionType, fetchData]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && userHashedKey && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchData();
    }
  }, [autoFetch, userHashedKey]); // Removed fetchData from dependencies

  return {
    data,
    loading,
    error,
    fetchData,
    transactionType,
  };
};

export default useGetAllOrders;
