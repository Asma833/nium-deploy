import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import dayjs from 'dayjs';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SearchInput } from './SearchInput';
import { TableSearchFilterProps } from '../types/filter.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const { search, dateRange, status, selects } = filterConfig.renderFilterOptions;
  const mode = filterConfig.mode || 'static';
  const callbacks = filterConfig.dynamicCallbacks;

  // Sentinel for representing an originally empty option (Radix disallows value="")
  const EMPTY_SENTINEL = '__EMPTY_OPTION__';

  interface AugmentedOption {
    value: string; // rendered value (never empty string)
    label: string;
    _key: string;
    _originalValue?: string; // keeps original (could be empty string)
    _isEmptySentinel?: boolean; // marks placeholder/clear option
  }

  const augmentOptions = (opts?: { value: string; label: string }[]): AugmentedOption[] => {
    if (!opts) return [];
    const counts: Record<string, number> = {};
    let hadEmpty = false;
    const processed: AugmentedOption[] = opts.map((opt, idx) => {
      const originalValue = opt.value;
      let safeValue = originalValue;
      if (safeValue === '') {
        safeValue = `${EMPTY_SENTINEL}`; // map to sentinel
        hadEmpty = true;
      }
      const base = safeValue.toString();
      counts[base] = (counts[base] || 0) + 1;
      const _key = counts[base] > 1 ? `${base}__${counts[base]}` : base;
      return {
        value: safeValue,
        label: opt.label,
        _key,
        _originalValue: originalValue,
        _isEmptySentinel: originalValue === '',
      };
    });
    // If there was an empty option we map it; keep its order (already included). Optionally could move to top.
    return processed;
  };

  // Status options (never include invalid empty value directly)
  const statusOptionsWithKeys: AugmentedOption[] = useMemo(() => augmentOptions(status?.options), [status?.options]);

  // Each select's options with augmentation
  const selectsWithKeys = useMemo(() => {
    if (!selects) return [];
    return selects.map((sel) => ({ ...sel, options: augmentOptions(sel.options) }));
  }, [selects]);

  // Store filter values locally to avoid applying them immediately
  const [localDateRange, setLocalDateRange] = useState(filters.dateRange);
  const [localStatus, setLocalStatus] = useState(filters.status);
  const [localCustomFilters, setLocalCustomFilters] = useState(filters.customFilterValues);

  // Add local state for search input to handle trailing spaces properly
  const [localSearchValue, setLocalSearchValue] = useState(filters.search);

  // Add refs for debounce timer and previous search value to optimize search
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const prevSearchValueRef = useRef(filters.search.trimEnd());

  // Update local search value when filters.search changes externally (e.g., from reset)
  useEffect(() => {
    setLocalSearchValue(filters.search);
  }, [filters.search]);

  const executeAsyncOperation = useCallback(
    async <T,>(operation: () => Promise<T>) => {
      if (setLoading) setLoading(true);
      try {
        const result = await operation();
        return result;
      } catch (error) {
        //console.error('Operation failed:', error);
        return null;
      } finally {
        if (setLoading) setLoading(false);
      }
    },
    [setLoading]
  );
  // Handle search clear/reset with optimization
  const handleSearchClear = useCallback(async () => {
    // Only reset the search filter, keep other filters intact
    if (mode === 'dynamic' && callbacks?.onSearch) {
      const result = await executeAsyncOperation(() => callbacks.onSearch!(''));
      if (setDynamicData && result) setDynamicData(result);
    } else {
      // For static mode - always call onFilter regardless of pagination state
      if (onFilter) {
        onFilter();
      }
    }
  }, [mode, callbacks, setDynamicData, onFilter, executeAsyncOperation]);

  // Improved search handling with better debounce and proper state management
  const handleSearchInputChange = useCallback(
    (value: string) => {
      // Update local search state immediately for UI responsiveness
      setLocalSearchValue(value);

      // Clear any existing timeout to implement debounce
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      // Set a new timeout for the search action
      searchDebounceRef.current = setTimeout(async () => {
        // Trim trailing spaces for the actual search operation
        const processedValue = value.trimEnd();

        // Update the main filter state with the processed value
        setFilters((prev: typeof filters) => ({
          ...prev,
          search: processedValue,
        }));

        // Only perform search if the processed value has changed
        if (processedValue !== prevSearchValueRef.current) {
          prevSearchValueRef.current = processedValue;

          if (processedValue === '') {
            // Handle empty search - clear results
            await handleSearchClear();
          } else if (mode === 'dynamic' && callbacks?.onSearch) {
            // For dynamic search - use processed value for API call
            const result = await executeAsyncOperation(() => callbacks.onSearch!(processedValue));
            if (setDynamicData && result) setDynamicData(result);
          } else {
            // For static filtering - always call onFilter for search regardless of pagination state
            if (onFilter) {
              onFilter();
            }
          }
        }
      }, 50);
    },
    [setFilters, handleSearchClear, mode, callbacks, executeAsyncOperation, setDynamicData, onFilter]
  );

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handleDateChange = useCallback((key: 'from' | 'to', date: Date | null) => {
    setLocalDateRange((prev) => {
      const updated = { ...prev, [key]: date ?? undefined };

      if (updated.from && updated.to && dayjs(updated.from).isAfter(dayjs(updated.to), 'day')) {
        updated.to = undefined; // Only clear "to" if "from" becomes greater
      }

      return updated;
    });
  }, []);

  const handleStatusChange = useCallback(
    (value: string) => {
      // Translate sentinel back to empty string for internal state consistency
      const translated = value === EMPTY_SENTINEL ? '' : value;
      if (status?.options?.some((option) => option.value === translated || option.value === '')) {
        setLocalStatus(translated);
      }
    },
    [status?.options]
  );

  const handleSelectChange = useCallback((id: string, value: string) => {
    const translated = value === EMPTY_SENTINEL ? '' : value;
    setLocalCustomFilters((prev: typeof filters.customFilterValues) => ({
      ...prev,
      [id]: translated,
    }));
  }, []);

  const handleDynamicFilter = useCallback(async () => {
    // Update the filters in the parent component
    const updatedFilters = {
      ...filters,
      dateRange: localDateRange,
      status: localStatus,
      customFilterValues: localCustomFilters,
    };

    setFilters(updatedFilters);

    // Always call onFilter regardless of pagination state for filter operations
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
    executeAsyncOperation,
  ]);

  const handleDynamicReset = useCallback(async () => {
    // Clear any pending search
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const resetFilters = {
      search: '',
      status: 'all',
      role: '',
      dateRange: { from: undefined, to: undefined },
      customFilterValues: {},
    };

    // Update prev search value ref to match reset state (empty trimmed value)
    prevSearchValueRef.current = '';

    setLocalDateRange(resetFilters.dateRange);
    setLocalStatus(resetFilters.status);
    setLocalCustomFilters(resetFilters.customFilterValues);
    setLocalSearchValue(resetFilters.search); // Reset the local search state
    setFilters({ ...filters, ...resetFilters });

    // Always call onReset regardless of pagination state
    if (onReset) onReset();

    if (mode === 'dynamic' && callbacks?.onFilterApply && setDynamicData) {
      const result = await executeAsyncOperation(() => callbacks?.onFilterApply?.(resetFilters) ?? Promise.resolve([]));
      if (result) setDynamicData(result);
    }
  }, [filters, mode, callbacks, onReset, setDynamicData, setFilters, executeAsyncOperation]);

  return (
    <div className="flex flex-col gap-3 w-full" role="search" aria-label="Table filter controls">
      <div className="flex items-end justify-between gap-4 flex-wrap text-[--primary-text]">
        <div className="flex items-end gap-2 flex-wrap">
          {dateRange && (
            <>
              <div className="flex items-start flex-col">
                <span id="from-date-label" className="text-sm whitespace-nowrap text-gray-500">
                  From Date
                </span>
                <DatePicker
                  value={localDateRange.from ? dayjs(localDateRange.from) : null}
                  onChange={(date) => handleDateChange('from', date?.toDate() || null)}
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
                <span id="to-date-label" className="text-sm whitespace-nowrap text-gray-500">
                  To Date
                </span>
                <DatePicker
                  value={localDateRange.to ? dayjs(localDateRange.to) : null}
                  onChange={(date) => handleDateChange('to', date?.toDate() || null)}
                  shouldDisableDate={(day) => !!localDateRange.from && day.isBefore(dayjs(localDateRange.from), 'day')}
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
              <span className="text-sm whitespace-nowrap text-gray-500">{status.label || 'Status'}:</span>
              <Select value={localStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] bg-[--filter-bg] text-[--filter-fg] border-none h-10">
                  <SelectValue placeholder={status.placeholder || `Select ${status.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {statusOptionsWithKeys.map((option) => (
                    <SelectItem key={option._key} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectsWithKeys &&
            selectsWithKeys.map((select) => (
              <div key={select.id} className="flex items-start flex-col ">
                <span className="text-sm whitespace-nowrap text-gray-500">{select.label}:</span>
                <Select
                  value={
                    localCustomFilters[select.id] === ''
                      ? (select.options as AugmentedOption[]).find((o) => o._isEmptySentinel)?.value || ''
                      : localCustomFilters[select.id] || ''
                  }
                  onValueChange={(value) => handleSelectChange(select.id, value)}
                >
                  <SelectTrigger className="min-w-fit w-[180px] bg-[--filter-bg] text-[--filter-fg] border-none h-10">
                    <SelectValue placeholder={select.placeholder || `Select ${select.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(select.options as AugmentedOption[]).map((option) => (
                      <SelectItem key={option._key} value={option.value}>
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
          <SearchInput value={localSearchValue} onChange={handleSearchInputChange} aria-label="Search table" />
        )}
      </div>
    </div>
  );
};

export default TableSearchFilter;
