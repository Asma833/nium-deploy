import { useState, useEffect } from 'react';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';

interface TransactionTypeItem {
  id: string;
  text: string;
}

/**
 * Custom hook to get transaction type text by ID or fetch all transaction types
 * @param id Optional transaction type ID to look up
 * @returns Object containing found transaction type text and loading state
 */
const useGetTransactionType = (id?: string) => {
  const [transactionTypes, setTransactionTypes] = useState<TransactionTypeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API.CONFIG.GET_TRANSACTION_TYPES);
        setTransactionTypes(response.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch transaction types'));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionTypes();
  }, []);

  // Find the transaction name if ID is provided
  const transactionType = id 
    ? transactionTypes.find(item => item.id === id)?.text || null
    : null;

  return { 
    transactionType,
    transactionTypes,
    loading,
    error
  };
};

export default useGetTransactionType;
