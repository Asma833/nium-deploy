import { useState } from 'react';
import { SetFilters } from '@/components/filter/filter.types';
import axios from 'axios';

interface UseFilterApiProps {
  endpoint: string;
  initialData?: any[];
  baseQueryParams?: Record<string, any>;
}

interface FilterApiResponse<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  search: (term: string) => Promise<T[]>;
  filterByDateRange: (from?: Date, to?: Date) => Promise<T[]>;
  filterByStatus: (status: string) => Promise<T[]>;
  filterBySelect: (id: string, value: string) => Promise<T[]>;
  applyFilters: (filters: SetFilters) => Promise<T[]>;
  resetFilters: () => Promise<T[]>;
}

/**
 * Hook for handling API-based filtering
 * @param endpoint - The API endpoint to call for filtering
 * @param initialData - Optional initial data to use when no filters are applied
 * @param baseQueryParams - Optional base query parameters to include in all requests
 */
export function useFilterApi<T = any>({ 
  endpoint, 
  initialData = [], 
  baseQueryParams = {} 
}: UseFilterApiProps): FilterApiResponse<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to make API calls
  const fetchFilteredData = async (params: Record<string, any>): Promise<T[]> => {
    setLoading(true);
    setError(null);

    try {
      // Combine base query params with the specific filter params
      const queryParams = { ...baseQueryParams, ...params };
      
      const response = await axios.get(endpoint, { params: queryParams });
      const result = response.data;
      
      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      return initialData;
    } finally {
      setLoading(false);
    }
  };

  // Search by term
  const search = async (term: string): Promise<T[]> => {
    return fetchFilteredData({ search: term });
  };

  // Filter by date range
  const filterByDateRange = async (from?: Date, to?: Date): Promise<T[]> => {
    const params: Record<string, any> = {};
    if (from) params.fromDate = from.toISOString();
    if (to) params.toDate = to.toISOString();
    return fetchFilteredData(params);
  };

  // Filter by status
  const filterByStatus = async (status: string): Promise<T[]> => {
    // Don't include status if it's "all"
    if (status === 'all') {
      return fetchFilteredData({});
    }
    return fetchFilteredData({ status });
  };

  // Filter by custom select field
  const filterBySelect = async (id: string, value: string): Promise<T[]> => {
    // Don't include value if it's "all"
    if (value === 'all') {
      return fetchFilteredData({});
    }
    return fetchFilteredData({ [id]: value });
  };

  // Apply all filters at once
  const applyFilters = async (filters: SetFilters): Promise<T[]> => {
    const params: Record<string, any> = {};

    // Add search term if present
    if (filters.search) {
      params.search = filters.search;
    }

    // Add date range if present
    if (filters.dateRange.from) {
      params.fromDate = filters.dateRange.from.toISOString();
    }
    if (filters.dateRange.to) {
      params.toDate = filters.dateRange.to.toISOString();
    }

    // Add status if present and not "all"
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }

    // Add role if present
    if (filters.role && filters.role !== '') {
      params.role = filters.role;
    }

    // Add custom filter values
    for (const [key, value] of Object.entries(filters.customFilterValues)) {
      if (value && value !== 'all') {
        params[key] = value;
      }
    }

    return fetchFilteredData(params);
  };

  // Reset filters and fetch initial data
  const resetFilters = async (): Promise<T[]> => {
    setData(initialData);
    return initialData;
  };

  return {
    data,
    loading,
    error,
    search,
    filterByDateRange,
    filterByStatus,
    filterBySelect,
    applyFilters,
    resetFilters
  };
}
