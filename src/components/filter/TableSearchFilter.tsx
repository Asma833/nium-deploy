import React from "react";
import { SearchInput } from "./SearchInput";

interface TableSearchFilterProps {
  filters: {
    search: string;
    status: string;
    role: string;
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
    customFilterValues: Record<string, string>;
  };

  setFilters: React.Dispatch<
    React.SetStateAction<{
      search: string;
      status: string;
      role: string;
      dateRange: {
        from: Date | undefined;
        to: Date | undefined;
      };
      customFilterValues: Record<string, string>;
    }>
  >;

  onFilter: () => void;
  onReset: () => void;
  filterConfig: {
    filterOption: boolean;
    rederFilerOptions: {
      search?: boolean;
      status?: boolean;
      role?: boolean;
      dateRange?: boolean;
    };
  };
}

const TableSearchFilter = ({
  filters,
  filterConfig,
  setFilters,
}: TableSearchFilterProps) => {
  const { search } = filterConfig.rederFilerOptions;
  return (
    <div className="flex items-center justify-end gap-4 flex-wrap text-[--primary-text]">
      {search && (
        <SearchInput
          value={filters.search}
          onChange={(value) => setFilters({ ...filters, search: value })}
        />
      )}
    </div>
  );
};

export default TableSearchFilter;
