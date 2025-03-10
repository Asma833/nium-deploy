import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSearchFilter from "../../filter/TableSearchFilter";
import TableDataLoader from "./TableDataLoader";
import { TablePagination } from "./TablePagination";
import { cn } from "@/utils/cn";
import { FileX2 } from "lucide-react";
import { useTableSorting } from "@/components/common/dynamic-table/hooks/useTableSorting";
import { useTablePagination } from "@/components/common/dynamic-table/hooks/useTablePagination";
import { Column, DynamicTableProps } from "../common-components.types";
import { SetFilters } from "../../filter/filter.types";

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

const getCellContent = <T extends Record<string, any>>(
  row: any,
  column: Column<T>
) => {
  if (column.cell) {
    return column.cell(row[column.id], row);
  }

  const value = row[column.id] || "-";

  if (value instanceof Date) {
    return formatDate(value);
  }

  if (typeof value === "string") {
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

export function DynamicTable<T extends Record<string, any>>({
  columns,
  tableWrapperClass,
  renderLeftSideActions,
  data: initialData,
  initialPageSize = 10,
  defaultSortColumn,
  defaultSortDirection = "asc",
  pageSizeOption = [10, 15, 20, 25],
  onRowClick,
  paginationMode,
  filter,
  loading: externalLoading,
  renderComponents,
  onPageChange,
  totalRecords,
}: DynamicTableProps<T>) {
  const [filters, setFilters] = useState<SetFilters>({
    search: "",
    status: "all",
    role: "",
    dateRange: { from: undefined, to: undefined },
    customFilterValues: {},
  });

  const [internalLoading, setInternalLoading] = useState(false);
  const [dynamicData, setDynamicData] = useState<T[]>([]);

  // Use dynamic data if in dynamic mode, otherwise use filtered data
  const mode = filter?.mode || "static";
  const loading = externalLoading || internalLoading;

  // Use either the dynamically fetched data or the original data based on mode
  const dataSource =
    mode === "dynamic" && dynamicData.length > 0 ? dynamicData : initialData;

  const { sortedData, sortColumn, sortDirection, toggleSort } = useTableSorting(
    dataSource,
    defaultSortColumn as string | undefined,
    defaultSortDirection
  );

  // Only filter data in static mode
  const filteredData =
    mode === "static"
      ? sortedData.filter((item) => {
          // Apply search filter
          if (filters.search && filter?.filterOption) {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch = columns.some((column) => {
              const value = item[column.id];
              if (value === undefined || value === null) return false;
              return String(value).toLowerCase().includes(searchTerm);
            });
            if (!matchesSearch) return false;
          }

          // Apply date range filter
          if (filter?.dateFilterColumn && filters.dateRange) {
            const dateColumn = filter.dateFilterColumn as string;
            const itemDate = item[dateColumn]
              ? new Date(item[dateColumn])
              : null;

            if (filters.dateRange.from && itemDate) {
              const fromDate = new Date(filters.dateRange.from);
              if (itemDate < fromDate) return false;
            }

            if (filters.dateRange.to && itemDate) {
              const toDate = new Date(filters.dateRange.to);
              toDate.setHours(23, 59, 59, 999); // End of the day
              if (itemDate > toDate) return false;
            }
          }

          // Apply status filter
          if (
            filter?.statusFilerColumn &&
            filters.status &&
            filters.status !== "all"
          ) {
            const statusColumn = filter.statusFilerColumn as string;
            if (item[statusColumn] !== filters.status) return false;
          }

          // Apply custom select filters
          for (const [key, value] of Object.entries(
            filters.customFilterValues
          )) {
            if (value && value !== "all" && item[key] !== value) return false;
          }

          return true;
        })
      : sortedData; // In dynamic mode, we don't filter locally

  const {
    paginatedData,
    totalPages,
    currentPage,
    pageSize,
    setPageSize,
    setCurrentPage,
  } = useTablePagination(filteredData, initialPageSize, pageSizeOption);

  const handleFilter = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
      role: "",
      dateRange: { from: undefined, to: undefined },
      customFilterValues: {},
    });
    setCurrentPage(1);

    // Reset dynamic data to empty if in dynamic mode
    if (mode === "dynamic") {
      setDynamicData([]);
    }
  };

  return (
    <div className="space-y-4 dynamic-table-container w-full">
      <div className="flex sm:items-center justify-between w-full md:flex-row flex-col">
        {renderLeftSideActions && (
          <div className="flex-1 py-2">{renderLeftSideActions()}</div>
        )}
        {(filter || renderComponents) && (
          <div className="w-full sm:flex-1 items-center sm:px-4 sm:py-2">
            {filter?.filterOption && (
              <div className="w-full sm:flex-1">
                <TableSearchFilter
                  filters={filters}
                  filterConfig={filter}
                  setFilters={setFilters}
                  onFilter={handleFilter}
                  onReset={handleReset}
                  setLoading={setInternalLoading}
                  setDynamicData={setDynamicData}
                />
              </div>
            )}
            {renderComponents && <div>{renderComponents}</div>}
          </div>
        )}
      </div>

      <div className={cn("overflow-x-auto w-full", tableWrapperClass)}>
        <div className="border rounded-lg shadow-sm overflow-clip">
          <Table className="w-full overflow-auto">
            <TableHeader className="bg-secondary">
              <TableRow>
                {columns.map((col: Column<T>) => (
                  <TableHead
                    key={col.id}
                    className={cn(
                      "min-w-40",
                      col.sortable && "cursor-pointer",
                      col.className
                    )}
                    onClick={() => col.sortable && toggleSort(col.id)}
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
            <TableBody>
              {!loading ? (
                paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className={cn(
                        onRowClick && "cursor-pointer hover:bg-gray-50"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((col: Column<T>) => (
                        <TableCell key={`${idx}-${col.key}`}>
                          {getCellContent(row, col)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="flex items-center justify-center space-x-2 py-20 text-primary">
                        <FileX2 size="20px" />
                        <div className="not-data-found-w">Data Not Found</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
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
          paginationMode={paginationMode || "static"}
          onPageChange={onPageChange}
          totalRecords={totalRecords ? totalRecords : filteredData.length}
        />
      )}
    </div>
  );
}
