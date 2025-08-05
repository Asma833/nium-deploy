import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { getEndpoint } from '@/core/constant/apis';
import { toast } from 'sonner';

interface FetchState {
  data: any | null;
  loading: boolean;
  error: string | null;
  fetchData: (params?: Record<string, any>) => Promise<void>;
}

export const useGetApi = (endpointKey: string, params?: any, autoFetch: boolean = true): FetchState => {
  const [data, setData] = useState<null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (queryParams?: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        const url = getEndpoint(endpointKey);
        const response = await axiosInstance.get(url, {
          params: queryParams || params,
        });
        setData(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';

        toast.error('Error Fetching Data', {
          description: errorMessage,
        });

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [endpointKey, params]
  );

  useEffect(() => {
    if (autoFetch) {
      void fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, fetchData };
};
