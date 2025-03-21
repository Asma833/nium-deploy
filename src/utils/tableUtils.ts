import { SetFilters } from "@/components/filter/filter.types";

/**
 * Utility function to create filter parameters for API requests
 * @param filters The filter values
 * @returns An object with formatted filter parameters for API
 */
export const createFilterParams = (filters: SetFilters): Record<string, any> => {
  const params: Record<string, any> = {};
  
  // Add search term
  if (filters.search) {
    params.search = filters.search;
  }
  
  // Add date range
  if (filters.dateRange.from) {
    params.fromDate = filters.dateRange.from.toISOString();
  }
  if (filters.dateRange.to) {
    params.toDate = filters.dateRange.to.toISOString();
  }
  
  // Add status
  if (filters.status && filters.status !== 'all') {
    params.status = filters.status;
  }
  
  // Add custom filters
  for (const [key, value] of Object.entries(filters.customFilterValues)) {
    if (value && value !== 'all') {
      params[key] = value;
    }
  }
  
  return params;
};

/**
 * Combined function to handle pagination and filtering
 * @param api Endpoint URL
 * @param page Current page
 * @param pageSize Items per page
 * @param filters Filter values
 * @returns Promise with the API response
 */
export const fetchTableData = async (
  api: string,
  page: number,
  pageSize: number,
  filters?: SetFilters
): Promise<any> => {
  try {
    const params: Record<string, any> = {
      page,
      pageSize,
    };
    
    // Add filters if provided
    if (filters) {
      Object.assign(params, createFilterParams(filters));
    }
    
    const response = await fetch(`${api}?${new URLSearchParams(params as any)}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
