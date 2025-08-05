import { useState } from 'react';
import axiosInstance from '@/core/services/axios/axiosInstance';

interface PaginationParams {
  page: number;
  pageSize: number;
  [key: string]: any; // Additional filter parameters
}

interface UseDynamicPaginationOptions {
  endpoint: string;
  initialPageSize?: number;
  additionalParams?: Record<string, any>;
  initialData?: any[];
  dataPath?: string; // Path to data in response (e.g., "transactions")
  totalRecordsPath?: string; // Path to totalRecords in response
}

export function useDynamicPagination<T = any>({
  endpoint,
  initialPageSize = 10,
  additionalParams = {},
  initialData = [],
  dataPath = 'data',
  totalRecordsPath = 'totalRecords',
}: UseDynamicPaginationOptions) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalRecords, setTotalRecords] = useState(initialData.length);

  // Function to fetch data with pagination
  const fetchData = async (params: PaginationParams): Promise<T[]> => {
    setLoading(true);
    setError(null);

    try {
      // Combine pagination params with additional params
      const queryParams = { ...params, ...additionalParams };

      const response = await axiosInstance.get(endpoint, {
        params: queryParams,
      });

      // Extract data and pagination info
      const responseData = extractValueFromPath(response.data, dataPath) || [];
      const responseTotalRecords = extractValueFromPath(response.data, totalRecordsPath) || responseData.length;

      setData(responseData);
      setTotalRecords(responseTotalRecords);

      return responseData;
    } catch (err: any) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract nested values from an object using a path string
  function extractValueFromPath(obj: any, path: string): any {
    if (!path) return obj;
    return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
  }

  // Handle page change
  const handlePageChange = async (page: number, size: number = pageSize): Promise<T[]> => {
    setCurrentPage(page);
    return await fetchData({ page, pageSize: size });
  };

  // Handle page size change
  const handlePageSizeChange = async (size: number): Promise<T[]> => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    return await fetchData({ page: 1, pageSize: size });
  };

  // Compute total pages
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Initial load
  const loadInitialData = () => {
    return fetchData({ page: currentPage, pageSize });
  };

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    loadInitialData,
    setAdditionalParams: (params: Record<string, any>) => {
      // Update additional params and refetch
      Object.assign(additionalParams, params);
      return fetchData({ page: 1, pageSize });
    },
  };
}
