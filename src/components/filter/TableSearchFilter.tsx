"use client";
import React from "react";
import { MoveRight, RotateCcw } from "lucide-react";
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
  onFilter,
  onReset,
}: TableSearchFilterProps) => {
  const { search, status, role, dateRange } = filterConfig.rederFilerOptions;
  return (
    <div className="flex items-center gap-4 flex-wrap text-[--primary-text]">
      {search && (
        <SearchInput
          value={filters.search}
          onChange={(value) => setFilters({ ...filters, search: value })}
        />
      )}
      {/* {status && (
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
          selectItem={["All", "unassigned", "rejected","draft"]}
        />
      )} */}
    
      <button className="btnBase btnPrimary p-3 rounded" onClick={onFilter}>
        <MoveRight />
      </button>
      <button
        className="btnBase text-[--reset-btn-bg] p-3 rounded hover:bg-[--secondary-btn-bg]"
        onClick={onReset}
      >
        <RotateCcw />
      </button>
    </div>
  );
};

export default TableSearchFilter;
