import { useState } from 'react';
import { FileX2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TableSearchFilter from '@/components/filter/TableSearchFilter';
import { cn } from '@/utils/cn';
import { useTableSorting } from '@/components/common/dynamic-table/hooks/useTableSorting';
import { useTablePagination } from '@/components/common/dynamic-table/hooks/useTablePagination';
import {
  Column,
  DynamicTableProps,
} from '@/components/types/common-components.types';
import { SetFilters } from '@/components/types/filter.types';
import { Button } from '@/components/ui/button';
import { TablePagination } from './TablePagination';
import TableDataLoader from './TableDataLoader';

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const getCellContent = <T extends Record<string, any>>(
  row: any,
  column: Column<T>
) => {
  if (column.cell) {
    return column.cell(row[column.id], row);
  }

  // Handle nested property paths with dot notation
  let value;
  if (column.id.includes('.')) {
    const parts = column.id.split('.');
    let nestedValue: any = row;
    for (const part of parts) {
      nestedValue = nestedValue?.[part];
      if (nestedValue === undefined) break;
    }
    value = nestedValue || '-';
  } else {
    value = row[column.id] || '-';
  }

  if (value instanceof Date) {
    return formatDate(value);
  }

  if (typeof value === 'string') {
    const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{2}[-/]\d{2}[-/]\d{4}/;
    if (datePattern.test(value) && !isNaN(Date.parse(value))) {
      return formatDate(value);
    }
  }

  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  return String(value ?? '');
};

export function DynamicTable<T extends Record<string, any>>({
  columns,
  tableWrapperClass,
  renderLeftSideActions,
  data: initialData,
  initialPageSize = 10,
  defaultSortColumn,
  defaultSortDirection = 'desc',
  pageSizeOption = [10, 15, 20, 25, 50],
  onRowClick,
  filter,
  refreshAction,
  loading: externalLoading,
  renderComponents,
  totalRecords,
}: DynamicTableProps<T>) {
  const [filters, setFilters] = useState<SetFilters>({
    search: '',
    status: 'all',
    role: '',
    dateRange: { from: undefined, to: undefined },
    customFilterValues: {},
  });

  const [internalLoading, setInternalLoading] = useState(false);
  const [dynamicData, setDynamicData] = useState<T[]>([]);

  // Track pagination action state
  const [isPaginationAction, setIsPaginationAction] = useState(false);

  // Use dynamic data if in dynamic mode, otherwise use filtered data
  const mode = filter?.mode || 'static';
  const loading = externalLoading || internalLoading;

  // Use either the dynamically fetched data or the original data based on mode
  const dataSource =
    mode === 'dynamic' && dynamicData.length > 0 ? dynamicData : initialData;

  const { sortedData, sortColumn, sortDirection, toggleSort } = useTableSorting(
    dataSource || [], // Ensure dataSource is an array
    defaultSortColumn as string | undefined,
    defaultSortDirection
  );

  // Ensure sortedData is always an array before filtering
  const dataToFilter = Array.isArray(sortedData) ? sortedData : [];

  // Only filter data in static mode
  const filteredData =
    mode === 'static'
      ? dataToFilter.filter((item) => {
          // Apply search filter
          if (filters.search && filter?.filterOption) {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch = columns.some((column) => {
              // Try to get the value from the column id, which could be a nested path
              let value: any;

              if (column.id.includes('.')) {
                // Handle nested properties for search as well
                const parts = column.id.split('.');
                let nestedValue: any = item;
                for (const part of parts) {
                  nestedValue = nestedValue?.[part];
                  if (nestedValue === undefined) break;
                }
                value = nestedValue;
              } else {
                value = item[column.id];
              }

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
            filters.status !== 'all'
          ) {
            const statusColumn = filter.statusFilerColumn as string;
            if (item[statusColumn] !== filters.status) return false;
          }

          // Apply custom select filters
          for (const [key, value] of Object.entries(
            filters.customFilterValues
          )) {
            if (value && value !== 'all') {
              // Handle nested properties with dot notation (e.g., 'purpose_type_name.purpose_name')
              if (key.includes('.')) {
                const parts = key.split('.');
                let nestedValue: any = item;
                // Navigate through the nested objects
                for (const part of parts) {
                  nestedValue = nestedValue?.[part];
                  if (nestedValue === undefined) break;
                }
                // If nestedValue is undefined or doesn't match, filter out
                if (nestedValue === undefined || nestedValue !== value)
                  return false;
              } else if (item[key] !== value) {
                // Standard property check
                return false;
              }
            }
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

  // We need to track filter operations separately
  const [lastFiltered, setLastFiltered] = useState<number>(0);

  // Force only one filter operation per 500ms
  const handleFilter = () => {
    const now = Date.now();
    // Skip if we're in the middle of a pagination action
    if (isPaginationAction) {
      return;
    }

    if (now - lastFiltered < 500) {
      return;
    }

    setLastFiltered(now);
    setCurrentPage(1);
  };

  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    if (isPaginationAction) return;

    const now = Date.now();
    if (now - lastFiltered < 500) return;

    setLastFiltered(now);

    setFilters({
      search: '',
      status: 'all',
      role: '',
      dateRange: { from: undefined, to: undefined },
      customFilterValues: {},
    });

    setCurrentPage(1);

    if (mode === 'dynamic') {
      setDynamicData([]);
    }
    //re-render of filter component
    setResetKey((prev) => prev + 1);
  };
  const handleRefreshWithReset = () => {
    // reset filters
    handleReset();
    // fetch fresh data
    refreshAction?.onRefresh();
  };
  // Track when setCurrentPage is called with proper timeout
  const handlePageChange = (page: number) => {
    // Only log when the page is actually changing to reduce noise
    if (page !== currentPage) {
      // Set pagination action flag to true before changing page
      setIsPaginationAction(true);
      // Set the page
      setCurrentPage(page);
      // Clear the pagination flag after a short delay
      setTimeout(() => {
        setIsPaginationAction(false);
      }, 200);
    }
  };

  return (
    <div className="space-y-4 dynamic-table-container w-full">
      {refreshAction && refreshAction.isRefreshButtonVisible && (
        <div className="flex items-center justify-between">
          <Button
            onClick={handleRefreshWithReset}
            variant="outline"
            size={'sm'}
          >
            {refreshAction.refreshButtonText
              ? refreshAction.refreshButtonText
              : 'Refresh Data'}
          </Button>

          <div>
            {refreshAction.isLoading && (
              <span className="text-blue-500">Loading data...</span>
            )}
            {refreshAction.hasError && (
              <span className="text-red-500">Error loading data</span>
            )}
          </div>
        </div>
      )}

      <div className="flex sm:items-center justify-between w-full md:flex-row flex-col">
        {renderLeftSideActions && (
          <div className="flex-1 py-2">{renderLeftSideActions()}</div>
        )}
        {(filter || renderComponents) && (
          <div className="w-full sm:flex-1 items-center sm:py-2">
            {filter?.filterOption && (
              <div className="w-full sm:flex-1">
                <TableSearchFilter
                  key={resetKey}
                  filters={filters}
                  filterConfig={filter}
                  setFilters={setFilters}
                  onFilter={handleFilter}
                  onReset={handleReset}
                  setLoading={setInternalLoading}
                  setDynamicData={setDynamicData}
                  isPaginationAction={isPaginationAction}
                />
              </div>
            )}
            {renderComponents && <div>{renderComponents}</div>}
          </div>
        )}
      </div>

      <div
        className={cn(
          'overflow-x-auto w-full bg-[--table-bg] rounded-lg shadow-sm',
          tableWrapperClass
        )}
      >
        <div className="border  overflow-clip">
          <Table className="odz-table w-full overflow-auto">
            <TableHeader className="bg-[--table-header]">
              <TableRow className="odz-table-row">
                {columns.map((col: Column<T>) => (
                  <TableHead
                    key={col.id}
                    className={cn(
                      'min-w-40 odz-th border-[--table-border] text-center',
                      col.sortable && 'cursor-pointer',
                      col.className
                    )}
                    onClick={() => col.sortable && toggleSort(col.id)}
                  >
                    {col.name}
                    {sortColumn === col.id && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="odz-table-body">
              {!loading ? (
                paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => {
                    const rowKey =
                      row.id ??
                      row.niumId ??
                      row._id ??
                      `${currentPage}-${idx}`;
                    return (
                      <TableRow
                        key={rowKey}
                        className={cn(
                          'odz-table-row',
                          onRowClick && 'cursor-pointer hover:bg-gray-50'
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {columns.map((col: Column<T>) => (
                          <TableCell
                            className="odz-table-cell text-center"
                            key={`${rowKey}-${col.key}`}
                          >
                            {getCellContent(row, col)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="odz-table-row">
                    <TableCell
                      className="odz-table-cell"
                      colSpan={columns.length}
                    >
                      <div className="odz-table-cell-inner flex items-center justify-center space-x-2 py-20 text-primary">
                        <FileX2 size="20px" />
                        <div className="not-data-found-w">Data Not Found</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow className="odz-table-row">
                  <TableCell
                    className="odz-table-cell"
                    colSpan={columns.length}
                  >
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
          setCurrentPage={handlePageChange}
          filteredDataLength={filteredData.length}
          totalRecords={totalRecords ? totalRecords : filteredData.length}
        />
      )}
    </div>
  );
}
