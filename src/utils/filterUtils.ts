import { SetFilters } from '@/components/filter/filter.types';

/**
 * Creates filter parameters for API requests
 * @param filters - The filters object
 * @returns An object with API-compatible filter parameters
 */
export const createFilterParams = (
  filters: SetFilters
): Record<string, any> => {
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

  return params;
};

/**
 * Filter an array of data based on search criteria
 * @param data - Array of data to filter
 * @param searchTerm - Search term to filter by
 * @param searchableFields - Optional array of fields to search in
 * @returns Filtered array of data
 */
export const filterBySearchTerm = <T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchableFields?: (keyof T)[]
): T[] => {
  if (!searchTerm) return data;

  const lowercaseTerm = searchTerm.toLowerCase();

  return data.filter((item) => {
    // If searchableFields are specified, only search those fields
    if (searchableFields?.length) {
      return searchableFields.some((field) => {
        const value = item[field];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(lowercaseTerm);
      });
    }

    // Otherwise search all fields
    return Object.values(item).some((value) => {
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(lowercaseTerm);
    });
  });
};

/**
 * Filter an array of data based on date range
 * @param data - Array of data to filter
 * @param dateField - Field name containing the date
 * @param fromDate - Start date for filtering
 * @param toDate - End date for filtering
 * @returns Filtered array of data
 */
export const filterByDateRange = <T extends Record<string, any>>(
  data: T[],
  dateField: keyof T,
  fromDate?: Date,
  toDate?: Date
): T[] => {
  if (!fromDate && !toDate) return data;

  return data.filter((item) => {
    const itemDate = item[dateField] ? new Date(item[dateField]) : null;
    if (!itemDate) return false;

    if (fromDate && itemDate < fromDate) return false;

    if (toDate) {
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (itemDate > endOfDay) return false;
    }

    return true;
  });
};

/**
 * Filter an array of data based on a field value
 * @param data - Array of data to filter
 * @param field - Field name to filter by
 * @param value - Value to filter for
 * @returns Filtered array of data
 */
export const filterByFieldValue = <T extends Record<string, any>>(
  data: T[],
  field: keyof T,
  value: string
): T[] => {
  if (value === 'all' || !value) return data;

  return data.filter((item) => item[field] === value);
};
