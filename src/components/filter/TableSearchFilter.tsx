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
import { useEffect } from "react";

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

  // For dynamic search with debounce
  useEffect(() => {
    if (mode === "dynamic" && callbacks?.onSearch && filters.search) {
      const handler = setTimeout(async () => {
        if (setLoading) setLoading(true);
        try {
          const result = await callbacks?.onSearch?.(filters.search);
          if (setDynamicData && result) setDynamicData(result);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          if (setLoading) setLoading(false);
        }
      }, 500);

      return () => clearTimeout(handler);
    }
    return;
  }, [mode, callbacks, filters.search, setLoading, setDynamicData]);

  const handleDateChange = async (key: "from" | "to", date: Date | null) => {
    const newDateRange = {
      ...filters.dateRange,
      [key]: date || undefined,
    };

    setFilters({
      ...filters,
      dateRange: newDateRange,
    });

    if (mode === "dynamic" && callbacks?.onDateRangeChange && setDynamicData) {
      if (setLoading) setLoading(true);
      try {
        const result = await callbacks.onDateRangeChange(
          newDateRange.from,
          newDateRange.to
        );
        setDynamicData(result);
      } catch (error) {
        console.error("Date range filter error:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    }
  };

  const handleStatusChange = async (value: string) => {
    setFilters({ ...filters, status: value });

    if (mode === "dynamic" && callbacks?.onStatusChange && setDynamicData) {
      if (setLoading) setLoading(true);
      try {
        const result = await callbacks.onStatusChange(value);
        setDynamicData(result);
      } catch (error) {
        console.error("Status filter error:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    }
  };

  const handleSelectChange = async (id: string, value: string) => {
    const newFilters = {
      ...filters,
      customFilterValues: {
        ...filters.customFilterValues,
        [id]: value,
      },
    };

    setFilters(newFilters);

    if (mode === "dynamic" && callbacks?.onSelectChange && setDynamicData) {
      if (setLoading) setLoading(true);
      try {
        const result = await callbacks.onSelectChange(id, value);
        setDynamicData(result);
      } catch (error) {
        console.error("Select filter error:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    }
  };

  const handleDynamicFilter = async () => {
    if (onFilter) onFilter();

    if (mode === "dynamic" && callbacks?.onFilterApply && setDynamicData) {
      if (setLoading) setLoading(true);
      try {
        const result = await callbacks.onFilterApply(filters);
        setDynamicData(result);
      } catch (error) {
        console.error("Filter apply error:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    }
  };

  const handleDynamicReset = async () => {
    if (onReset) onReset();

    // Additional reset logic for dynamic mode could be added here
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-end  justify-between gap-4 flex-wrap text-[--primary-text]">
        <div className="flex items-end gap-2">
          {dateRange && (
            <>
              <div className="flex items-start flex-col ">
                <span className="text-sm whitespace-nowrap text-gray-500">
                  From Date
                </span>
                <DatePicker
                  value={
                    filters.dateRange.from
                      ? dayjs(filters.dateRange.from)
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
                  className="bg-gray-200"
                />
              </div>
              <div className="flex items-start flex-col ">
                <span className="text-sm whitespace-nowrap text-gray-500">
                  To Date
                </span>
                <DatePicker
                  value={
                    filters.dateRange.to ? dayjs(filters.dateRange.to) : null
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
                  className="bg-gray-200"
                />
              </div>
            </>
          )}

          {status && status.options && (
            <div className="flex items-start flex-col ">
              <span className="text-sm whitespace-nowrap text-gray-500">
                {status.label || "Status"}:
              </span>
              <Select value={filters.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] bg-gray-200 border-none h-10">
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
                  value={filters.customFilterValues[select.id] || ""}
                  onValueChange={(value) =>
                    handleSelectChange(select.id, value)
                  }
                >
                  <SelectTrigger className="w-[180px] bg-gray-200 border-none h-10">
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
          {(onFilter || onReset) && (
            <div className="flex justify-end gap-2">
              {onFilter && (
                <Button
                  onClick={mode === "dynamic" ? handleDynamicFilter : onFilter}
                  size="sm"
                  variant="default"
                  className="h-10"
                >
                  Apply Filters
                </Button>
              )}
              {onReset && (
                <Button
                  onClick={mode === "dynamic" ? handleDynamicReset : onReset}
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
