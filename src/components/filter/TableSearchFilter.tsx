import dayjs from 'dayjs';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState, useCallback } from 'react';

import { SearchInput } from './SearchInput';
import { TableSearchFilterProps } from './filter.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const CustomCalendarIcon = () => {
  return (
    <div className="text-gray-500">
      <CalendarDays className="h-4 w-4" />
    </div>
  );
};

const TableSearchFilter = ({
  filters,
  filterConfig,
  setFilters,
  onFilter,
  onReset,
  setLoading,
  setDynamicData,
}: TableSearchFilterProps) => {
  const { search, dateRange, status, selects } =
    filterConfig.renderFilterOptions;
  const mode = filterConfig.mode || 'static';
  const callbacks = filterConfig.dynamicCallbacks;

  // Store filter values locally to avoid applying them immediately
  const [localDateRange, setLocalDateRange] = useState(filters.dateRange);
  const [localStatus, setLocalStatus] = useState(filters.status);
  const [localCustomFilters, setLocalCustomFilters] = useState(
    filters.customFilterValues
  );

  const executeAsyncOperation = useCallback(
    async <T,>(operation: () => Promise<T>) => {
      if (setLoading) setLoading(true);
      try {
        const result = await operation();
        return result;
      } catch (error) {
        console.error('Operation failed:', error);
        return null;
      } finally {
        if (setLoading) setLoading(false);
      }
    },
    [setLoading]
  );

  // Handle search clear/reset - moved up before it's referenced in useEffect
  const handleSearchClear = useCallback(async () => {
    // Only reset the search filter, keep other filters intact
    if (mode === 'dynamic' && callbacks?.onSearch) {
      const result = await executeAsyncOperation(() => callbacks.onSearch!(''));
      if (setDynamicData && result) setDynamicData(result);
    } else {
      // For static mode
      if (onFilter) onFilter();
    }
  }, [mode, callbacks, setDynamicData, onFilter, executeAsyncOperation]);

  // For dynamic search with debounce
  useEffect(() => {
    let handler: NodeJS.Timeout | undefined;

    if (filters.search) {
      handler = setTimeout(async () => {
        if (mode === 'dynamic' && callbacks?.onSearch) {
          const result = await executeAsyncOperation(() =>
            callbacks.onSearch!(filters.search)
          );
          if (setDynamicData && result) setDynamicData(result);
        } else {
          // For static mode, apply filter immediately
          if (onFilter) onFilter();
        }
      }, 500);
    } else {
      // If search is cleared, immediately reset/refresh the table
      handleSearchClear();
    }

    return () => {
      if (handler) clearTimeout(handler);
    };
  }, [
    filters.search,
    mode,
    callbacks,
    setDynamicData,
    onFilter,
    executeAsyncOperation,
    handleSearchClear,
  ]);

  const handleDateChange = useCallback(
    (key: 'from' | 'to', date: Date | null) => {
      setLocalDateRange((prev: typeof filters.dateRange) => ({
        ...prev,
        [key]: date || undefined,
      }));
    },
    []
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      if (status?.options?.some((option) => option.value === value)) {
        setLocalStatus(value);
      }
    },
    [status?.options]
  );

  const handleSelectChange = useCallback((id: string, value: string) => {
    setLocalCustomFilters((prev: typeof filters.customFilterValues) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleSearchInputChange = useCallback(
    (value: string) => {
      setFilters((prev: typeof filters) => ({ ...prev, search: value }));
    },
    [setFilters]
  );

  const handleDynamicFilter = useCallback(async () => {
    const updatedFilters = {
      ...filters,
      dateRange: localDateRange,
      status: localStatus,
      customFilterValues: localCustomFilters,
    };

    setFilters(updatedFilters);

    if (onFilter) await onFilter();

    if (mode === 'dynamic' && callbacks?.onFilterApply && setDynamicData) {
      const result = await executeAsyncOperation(
        () => callbacks?.onFilterApply?.(updatedFilters) ?? Promise.resolve([])
      );
      if (result) setDynamicData(result);
    }
  }, [
    filters,
    localDateRange,
    localStatus,
    localCustomFilters,
    mode,
    callbacks,
    onFilter,
    setDynamicData,
    setFilters,
    setLoading,
    executeAsyncOperation,
  ]);

  const handleDynamicReset = useCallback(async () => {
    const resetFilters = {
      search: '',
      status: 'all',
      role: '',
      dateRange: { from: undefined, to: undefined },
      customFilterValues: {},
    };

    setLocalDateRange(resetFilters.dateRange);
    setLocalStatus(resetFilters.status);
    setLocalCustomFilters(resetFilters.customFilterValues);
    setFilters({ ...filters, ...resetFilters });

    if (onReset) onReset();

    if (mode === 'dynamic' && callbacks?.onFilterApply && setDynamicData) {
      const result = await executeAsyncOperation(
        () => callbacks?.onFilterApply?.(resetFilters) ?? Promise.resolve([])
      );
      if (result) setDynamicData(result);
    }
  }, [
    filters,
    mode,
    callbacks,
    onReset,
    setDynamicData,
    setFilters,
    setLoading,
    executeAsyncOperation,
  ]);

  return (
    <div
      className="flex flex-col gap-3 w-full"
      role="search"
      aria-label="Table filter controls"
    >
      <div className="flex items-end justify-between gap-4 flex-wrap text-[--primary-text]">
        <div className="flex items-end gap-2 flex-wrap">
          {dateRange && (
            <>
              <div className="flex items-start flex-col">
                <span
                  id="from-date-label"
                  className="text-sm whitespace-nowrap text-gray-500"
                >
                  From Date
                </span>
                <DatePicker
                  value={
                    localDateRange.from ? dayjs(localDateRange.from) : null
                  }
                  onChange={(date) =>
                    handleDateChange('from', date?.toDate() || null)
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      inputProps: {
                        'aria-labelledby': 'from-date-label',
                      },
                      sx: {
                        borderRadius: '5px',
                        width: '170px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                          borderRadius: '20px',
                        },
                      },
                    },
                  }}
                  slots={{
                    openPickerIcon: () => <CustomCalendarIcon />,
                  }}
                  format="DD/MM/YYYY"
                  className="bg-[--filter-bg] text-[--filter-fg]"
                />
              </div>
              <div className="flex items-start flex-col">
                <span
                  id="to-date-label"
                  className="text-sm whitespace-nowrap text-gray-500"
                >
                  To Date
                </span>
                <DatePicker
                  value={localDateRange.to ? dayjs(localDateRange.to) : null}
                  onChange={(date) =>
                    handleDateChange('to', date?.toDate() || null)
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      inputProps: {
                        'aria-labelledby': 'to-date-label',
                      },
                      sx: {
                        borderRadius: '5px',
                        width: '170px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                          borderRadius: '20px',
                        },
                      },
                    },
                  }}
                  slots={{
                    openPickerIcon: () => <CustomCalendarIcon />,
                  }}
                  format="DD/MM/YYYY"
                  className="bg-[--filter-bg] text-[--filter-fg]"
                />
              </div>
            </>
          )}

          {status && status.options && (
            <div className="flex items-start flex-col ">
              <span className="text-sm whitespace-nowrap text-gray-500">
                {status.label || 'Status'}:
              </span>
              <Select value={localStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] bg-[--filter-bg] text-[--filter-fg] border-none h-10">
                  <SelectValue
                    placeholder={status.placeholder || `Select ${status.label}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {status.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selects &&
            selects.map((select) => (
              <div key={select.id} className="flex items-start flex-col ">
                <span className="text-sm whitespace-nowrap text-gray-500">
                  {select.label}:
                </span>
                <Select
                  value={localCustomFilters[select.id] || ''}
                  onValueChange={(value) =>
                    handleSelectChange(select.id, value)
                  }
                >
                  <SelectTrigger className="w-[180px] bg-[--filter-bg] text-[--filter-fg] border-none h-10">
                    <SelectValue
                      placeholder={
                        select.placeholder || `Select ${select.label}`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {select.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          {filterConfig.renderFilterOptions.applyAction &&
            filterConfig.renderFilterOptions.resetAction &&
            (onFilter || onReset) && (
              <div className="flex justify-end gap-2">
                {onFilter && (
                  <Button
                    onClick={handleDynamicFilter}
                    size="sm"
                    variant="default"
                    className="h-10"
                    aria-label="Apply filters"
                  >
                    Apply Filters
                  </Button>
                )}
                {onReset && (
                  <Button
                    onClick={handleDynamicReset}
                    size="sm"
                    variant="outline"
                    className="h-10 flex gap-1"
                    aria-label="Reset filters"
                  >
                    <RefreshCw size={16} />
                    Reset
                  </Button>
                )}
              </div>
            )}
        </div>
        {search && (
          <SearchInput
            value={filters.search}
            onChange={handleSearchInputChange}
            aria-label="Search table"
          />
        )}
      </div>
    </div>
  );
};

export default TableSearchFilter;
