"use client";
import { useState, useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataNotFound from "@/assets/images/DataNotFound.svg";
import TableSearchFilter from "../filter/TableSearchFilter";
import Image from "./Image";
import TableDataLoader from "./TableDataLoader";
import { TablePagination } from "./TablePagination";


interface Column<T> {
  key: number | string;
  id: string;
  name: string;
  className?: string; // Add this line
  cell?: (
    value: string | number | Date | React.ReactNode | null,
    row: T
  ) => React.ReactNode; // Updated to include cell renderer
  sortable?: boolean;
}

interface DynamicTableProps<T> {
  columns: any;
  data: T[];
  initialPageSize?: number;
  pageSizeOption?: number[];
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  filterComponents?: React.ReactNode;
  renderComponents?: React.ReactNode;
  loading?: boolean;
  filter?: any;
}

export function DynamicTable<T extends Record<string, any>>({
  columns,
  data: initialData,
  initialPageSize = 10,
  defaultSortColumn,
  defaultSortDirection = "asc",
  pageSizeOption = [10, 15, 20, 25],
  onRowClick,
  filter,
  loading,
  renderComponents,
}: DynamicTableProps<T>) {
  const [pageSize, setPageSize] = useState<number>(
    pageSizeOption?.[0] || initialPageSize
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<string | undefined>(
    defaultSortColumn
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    defaultSortDirection
  );
  const [filters, setFilters] = useState<{
    search: string;
    status: string;
    role: string;
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
    customFilterValues: Record<string, string>;
  }>({
    search: "",
    status: "",
    role: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    customFilterValues: {},
  });
  const [appliedFilters, setAppliedFilters] = useState<{
    search: string;
    status: string;
    role: string;
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
    customFilterValues: Record<string, string>;
  }>({
    search: "",
    status: "all",
    role: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    customFilterValues: {},
  });

  // console.log("appliedFilters", appliedFilters);

  const handleFilter = () => {
    setAppliedFilters(filters);
    // console.log("filters", filters);

    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
      role: "",
      dateRange: {
        from: undefined,
        to: undefined,
      },
      customFilterValues: {},
    });
    setAppliedFilters({
      search: "",
      status: "all",
      role: "",
      dateRange: {
        from: undefined,
        to: undefined,
      },
      customFilterValues: {},
    });
    setCurrentPage(1);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getCellContent = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row[column.id], row);
    }

    const value = row[column.id] || "-";

    // Check if value is an actual Date object
    if (value instanceof Date) {
      return formatDate(value);
    }

    // For string values, only parse as date if it matches a date pattern
    if (typeof value === "string") {
      // Check for common date formats using regex
      const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{2}[-/]\d{2}[-/]\d{4}/;
      if (datePattern.test(value) && !isNaN(Date.parse(value))) {
        return formatDate(value);
      }
    }

    if (typeof value === "object" && value !== null) {
      try {
        return JSON.stringify(value);
      } catch {
        return "";
      }
    }

    return String(value ?? "");
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(initialData)) return [];

    return initialData.filter((item) => {
      if (!item) return false;

      const searchMatch = appliedFilters.search
        ? Object.values(item).some((value) =>
            String(value)
              .toLowerCase()
              .includes(appliedFilters.search.toLowerCase())
          )
        : true;

      const statusMatch = (() => {
        if (!filter?.statusFilerColumn || appliedFilters.status === "all") {
          return true;
        }
        const itemStatus = item[filter.statusFilerColumn];

        // Safely convert to string and compare
        return (
          String(itemStatus || "").toLowerCase() ===
          appliedFilters.status.toLowerCase()
        );
      })();

      const roleMatch = (() => {
        if (!filter?.roleFilerColumn || !appliedFilters.role) {
          return true;
        }
        const itemRole = item[filter.roleFilerColumn];
        // Safely convert to string and compare
        return (
          String(itemRole || "").toLowerCase() ===
          appliedFilters.role.toLowerCase()
        );
      })();

      const dateMatch = (() => {
        if (
          !appliedFilters.dateRange.from ||
          !appliedFilters.dateRange.to ||
          !filter?.dateFilterColumn
        ) {
          return true;
        }

        const itemDateValue = item[filter.dateFilterColumn];
        if (!itemDateValue) return false;

        const itemDate = new Date(itemDateValue);
        const fromDate = new Date(appliedFilters.dateRange.from);
        const toDate = new Date(appliedFilters.dateRange.to);

        itemDate.setHours(0, 0, 0, 0);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        const itemTime = itemDate.getTime();
        return itemTime >= fromDate.getTime() && itemTime <= toDate.getTime();
      })();

      return searchMatch && statusMatch && roleMatch && dateMatch;
    });
  }, [
    initialData,
    appliedFilters,
    filter?.dateFilterColumn,
    filter?.statusFilerColumn,
    filter?.roleFilerColumn,
  ]);

  const sortedData = useMemo(() => {
    if (!sortColumn || !Array.isArray(filteredData)) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (!a || !b) return 0;

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    if (!Array.isArray(sortedData)) return [];

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil((filteredData?.length || 0) / pageSize);
  }, [filteredData, pageSize]);



  return (
    <div className="space-y-4 dynamic-table-container">
      {(filter || renderComponents) && (
        <div className="flex w-full items-center px-4 py-2">
          {filter?.filterOption && (
            <div className="flex-1">
              <TableSearchFilter
                filters={filters}
                filterConfig={filter}
                setFilters={setFilters}
                onFilter={handleFilter}
                onReset={handleReset}
              />
            </div>
          )}
          {renderComponents && <div>{renderComponents}</div>}
        </div>
      )}
      <div className="border ">
        <Table>
          <TableHeader>
            <TableRow>
                {columns.map((col: Column<T>) => (
                <TableHead
                  key={col.id}
                  className={`${col.sortable ? "cursor-pointer" : ""} ${
                  col.className || ""
                  }`}
                  onClick={() => {
                  if (col.sortable) {
                    setSortColumn(col.id);
                    setSortDirection(
                    sortColumn === col.id && sortDirection === "asc"
                      ? "desc"
                      : "asc"
                    );
                  }
                  }}
                >
                  {col.name}
                  {sortColumn === col.id && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                  )}
                </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody >
            {!loading ? (
              
                paginatedData.length > 0 ? 

         
                (   paginatedData.map((row, idx) => (
                    <TableRow
                    key={idx}
                    className={
                      onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                    }
                    onClick={() => onRowClick?.(row)}
                    >
                    {columns.map((col: Column<T>) => (
                      <TableCell key={`${idx}-${col.key}`}>
                      {getCellContent(row, col)}
                      </TableCell>
                    ))}
                    </TableRow>
                 
                )))
            
                : 
                <TableRow>
                <TableCell colSpan={columns.length }>
                  <div className="not-data-found-w">
                    <Image src={DataNotFound} alt="No Data" width={250} height={250} />
                  </div>
                </TableCell>
              </TableRow>

            
              
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <TableDataLoader />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {initialData?.length !== 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOption={pageSizeOption}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
          filteredDataLength={filteredData.length}
        />
      )}
    </div>
  );
}
