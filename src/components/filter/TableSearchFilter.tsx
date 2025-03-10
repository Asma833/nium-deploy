import { SearchInput } from "./SearchInput";
import { TableSearchFilterProps } from "./filter.types";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarDays, RefreshCw } from "lucide-react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";

const TableSearchFilter = ({
  filters,
  filterConfig,
  setFilters,
  onFilter,
  onReset,
  setLoading,
  setDynamicData,
}: TableSearchFilterProps) => {
  const { search, dateRange, status, selects } = filterConfig.rederFilerOptions;
  const mode = filterConfig.mode || "static";
  const callbacks = filterConfig.dynamicCallbacks;
  
  // Store filter values locally to avoid applying them immediately 
  const [localDateRange, setLocalDateRange] = useState(filters.dateRange);
  const [localStatus, setLocalStatus] = useState(filters.status);
  const [localCustomFilters, setLocalCustomFilters] = useState(filters.customFilterValues);

  // For dynamic search with debounce
  useEffect(() => {
    if (filters.search) {
      const handler = setTimeout(async () => {
        if (mode === "dynamic" && callbacks?.onSearch) {
          if (setLoading) setLoading(true);
          try {
            const result = await callbacks?.onSearch?.(filters.search);
            if (setDynamicData && result) setDynamicData(result);
          } catch (error) {
            console.error("Search error:", error);
          } finally {
            if (setLoading) setLoading(false);
          }
        } else {
          // For static mode, apply filter immediately
          if (onFilter) onFilter();
        }
      }, 500);

      return () => clearTimeout(handler);
    } else {
      // If search is cleared, immediately reset/refresh the table
      handleSearchClear();
    }
    return undefined;
  }, [filters.search]);
  
  // Handle search clear/reset
  const handleSearchClear = () => {
    // Only reset the search filter, keep other filters intact
    if (mode === "dynamic" && callbacks?.onSearch) {
      if (setLoading) setLoading(true);
      try {
        callbacks?.onSearch?.("").then(result => {
          if (setDynamicData && result) setDynamicData(result);
        });
      } catch (error) {
        console.error("Search reset error:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    } else {
      // For static mode
      if (onFilter) onFilter();
    }
  };

  const handleDateChange = (key: "from" | "to", date: Date | null) => {
    // Update local state but don't apply filter yet
    setLocalDateRange({
      ...localDateRange,
      [key]: date || undefined,
    });
  };

  const handleStatusChange = (value: string) => {
    // Update local state but don't apply filter yet
    setLocalStatus(value);
  };

  const handleSelectChange = (id: string, value: string) => {
    // Update local state but don't apply filter yet
    setLocalCustomFilters({
      ...localCustomFilters,
      [id]: value,
    });
  };

  const handleDynamicFilter = async () => {
    // Apply all filters at once when the Apply button is clicked
    const updatedFilters = {
      ...filters,
      dateRange: localDateRange,
      status: localStatus,
      customFilterValues: localCustomFilters
    };
    
    // Update the parent component's filter state
    setFilters(updatedFilters);
    
    if (onFilter) onFilter();

    if (mode === "dynamic" && callbacks?.onFilterApply && setDynamicData) {
      if (setLoading) setLoading(true);
      try {
        const result = await callbacks.onFilterApply(updatedFilters);
        setDynamicData(result);
      } catch (error) {
        console.error("Filter apply error:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    }
  };

  const handleDynamicReset = async () => {
    // Reset local states
    setLocalDateRange({ from: undefined, to: undefined });
    setLocalStatus("all");
    setLocalCustomFilters({});
    
    // Reset parent component's filter state
    setFilters({
      ...filters,
      search: "", // Also reset search
      status: "all",
      role: "",
      dateRange: { from: undefined, to: undefined },
      customFilterValues: {},
    });
    
    if (onReset) onReset();

    // Additional reset logic for dynamic mode
    if (mode === "dynamic" && callbacks?.onFilterApply && setDynamicData) {
      if (setLoading) setLoading(true);
      try {
        const result = await callbacks.onFilterApply({
          search: "",
          status: "all",
          role: "",
          dateRange: { from: undefined, to: undefined },
          customFilterValues: {},
        });
        setDynamicData(result);
      } catch (error) {
        console.error("Filter reset error:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-end justify-between gap-4 flex-wrap text-[--primary-text]">
        <div className="flex items-end gap-2 flex-wrap">
          {dateRange && (
            <>
              <div className="flex items-start flex-col ">
                <span className="text-sm whitespace-nowrap text-gray-500">
                  From Date
                </span>
                <DatePicker
                  value={
                    localDateRange.from
                      ? dayjs(localDateRange.from)
                      : null
                  }
                  onChange={(date) =>
                    handleDateChange("from", date?.toDate() || null)
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        borderRadius: "5px",
                        width: "170px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                          borderRadius: "20px",
                        },
                      },
                    },
                  }}
                  slots={{
                    openPickerIcon: CalendarDays,
                  }}
                  format="DD/MM/YYYY"
                  className="bg-[--filter-bg] text-[--filter-fg]"
                />
              </div>
              <div className="flex items-start flex-col ">
                <span className="text-sm whitespace-nowrap text-gray-500">
                  To Date
                </span>
                <DatePicker
                  value={
                    localDateRange.to ? dayjs(localDateRange.to) : null
                  }
                  onChange={(date) =>
                    handleDateChange("to", date?.toDate() || null)
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        borderRadius: "5px",
                        width: "170px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                          borderRadius: "20px",
                        },
                      },
                    },
                  }}
                  slots={{
                    openPickerIcon: CalendarDays,
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
                {status.label || "Status"}:
              </span>
              <Select value={localStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] bg-[--filter-bg] text-[--filter-fg] border-none h-10">
                  <SelectValue
                    placeholder={status.placeholder || "Select status"}
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
                  value={localCustomFilters[select.id] || ""}
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
          {filterConfig.rederFilerOptions.applyAction &&
            filterConfig.rederFilerOptions.resetAction &&
            (onFilter || onReset) && (
              <div className="flex justify-end gap-2">
                {onFilter && (
                  <Button
                    onClick={handleDynamicFilter}
                    size="sm"
                    variant="default"
                    className="h-10"
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
            onChange={(value) => setFilters({ ...filters, search: value })}
          />
        )}
      </div>
    </div>
  );
};

export default TableSearchFilter;
