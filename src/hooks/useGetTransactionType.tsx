import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API, HEADER_KEYS } from '@/core/constant/apis';

export interface TransactionTypeItem {
  id: string;
  text: string;
}

/**
 * Fetches transaction types from the API with proper headers
 * @returns Promise that resolves to an array of transaction types
 */
const fetchTransactionTypes = async (): Promise<TransactionTypeItem[]> => {
  try {
    const response = await axiosInstance.get(API.CONFIG.GET_TRANSACTION_TYPES, {
      headers: {
        accept: 'application/json',
        api_key: HEADER_KEYS.API_KEY,
        partner_id: HEADER_KEYS.PARTNER_ID,
      },
    });

    // Check if response and response.data exist before returning
    if (response && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching transaction types:', error);
    return [];
  }
};

/**
 * Custom hook to get transaction type text by ID or fetch all transaction types
 * Uses TanStack Query for efficient data fetching with caching
 * @param id Optional transaction type ID to look up
 * @returns Object containing found transaction type text and loading state
 */
const useGetTransactionType = (id?: string) => {
  const {
    data: transactionTypes = [],
    isLoading: loading,
    error,
    isError,
  } = useQuery<TransactionTypeItem[], Error>({
    queryKey: ['transactionTypes'],
    queryFn: fetchTransactionTypes,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 1,
  });

  // Find the transaction name if ID is provided
  const transactionType = id
    ? transactionTypes.find((item) => item.id === id)?.text || null
    : null;

  return {
    transactionType,
    transactionTypes,
    loading,
    error: isError ? error : null,
  };
};

export default useGetTransactionType;
