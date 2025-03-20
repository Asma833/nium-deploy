import { useState, useEffect } from 'react';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';

interface PurposeTypeItem {
  id: string;
  text: string;
}

/**
 * Custom hook to get purpose type text by ID or fetch all purpose types
 * @param id Optional purpose type ID to look up
 * @returns Object containing found purpose name and loading state
 */
const useGetPurposeName = (id?: string) => {
  const [purposeTypes, setPurposeTypes] = useState<PurposeTypeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPurposeTypes = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API.CONFIG.GET_PURPOSE_TYPES);
        setPurposeTypes(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching purpose types:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch purpose types'));
      } finally {
        setLoading(false);
      }
    };

    fetchPurposeTypes();
  }, []);

  // Find the purpose name if ID is provided
  const purposeName = id 
    ? purposeTypes.find(item => item.id === id)?.text || null
    : null;

  return { 
    purposeName,
    purposeTypes,
    loading,
    error
  };
};

export default useGetPurposeName;


// const { purposeName, loading: purposeLoading } = useGetPurposeName('603e51b68ffd0e2ad8a8dfcdad7f9dd3m8eao94v');
// const { transactionType, loading: transactionLoading } = useGetTransactionType('603e51b68ffd0e2ad8a8dfcdad7f9dd3m8eao94v');
