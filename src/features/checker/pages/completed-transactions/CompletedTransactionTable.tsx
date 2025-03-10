import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { transactionTableData as initialData } from "../assign/assign-table/assign-table-value";
import { useEffect } from "react";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { Button } from "@/components/ui/button";
import { API } from "@/core/constant/apis";
import { transactionTableData } from "./completed-transaction-table-value";
import { getTransactionTableColumns } from "./completed-transaction-table-col";
import { exportToCSV } from "@/utils/exportUtils";

const CompletedTransactionTable = () => {
  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

  // Use the dynamic pagination hook
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.COMPLETED_TRANSACTIONS.SEARCH_FILTER,
    initialPageSize: 10,
    initialData,
    dataPath: "transactions", // Adjust based on your API response structure
    totalRecordsPath: "totalRecords",
  });

  // Using the filter API hook
  const filterApi = useFilterApi({
    endpoint: API.CHECKER.COMPLETED_TRANSACTIONS.SEARCH_FILTER,
    initialData,
    // base query params if needed
    baseQueryParams: {
      // For example: clientId: '123'
    },
  });

  const columns = getTransactionTableColumns();

  const handleExportToCSV = () => {
    const dataToExport = isPaginationDynamic
      ? pagination.data
      : isTableFilterDynamic && filterApi.data.length > 0
      ? filterApi.data
      : transactionTableData;

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, "completed-transactions");
  };

  // Define transaction type options
  const transactionTypeOptions = [
    { label: "All Types", value: "all" },
    { label: "Transfer", value: "transfer" },
    { label: "Payment", value: "payment" },
    { label: "Deposit", value: "deposit" },
    { label: "Withdrawal", value: "withdrawal" },
  ];

  // Define status options
  const transactionStatusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Failed", value: "failed" },
    { label: "Processing", value: "processing" },
  ];

  // Load initial data when the component mounts
  useEffect(() => {
    if (isPaginationDynamic) {
      pagination.loadInitialData();
    }
  }, [isPaginationDynamic, pagination]);

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center">
        {(filterApi.loading || pagination.loading) && (
          <span className="text-blue-500">Loading data...</span>
        )}
        {(filterApi.error || pagination.error) && (
          <span className="text-red-500">Error loading data</span>
        )}
      </div>

      <DynamicTable
        columns={columns}
        data={
          isPaginationDynamic
            ? pagination.data
            : isTableFilterDynamic && filterApi.data.length > 0
            ? filterApi.data
            : transactionTableData
        }
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        loading={filterApi.loading || pagination.loading}
        paginationMode={isPaginationDynamic ? "dynamic" : "static"}
        onPageChange={
          isPaginationDynamic
            ? pagination.handlePageChange
            : async (_page: number, _pageSize: number) => []
        }
        totalRecords={pagination.totalRecords}
        filter={{
          filterOption: true,
          mode: isTableFilterDynamic ? "dynamic" : "static",
          dateFilterColumn: "orderDate",
          statusFilerColumn: "status",
          roleFilerColumn: "role",
          rederFilerOptions: {
            search: true,
            dateRange: true,
            applyAction: true,
            resetAction: true,
            status: {
              label: "Status",
              placeholder: "Select status",
              options: transactionStatusOptions,
            },
            selects: [
              {
                id: "transactionType",
                label: "Type",
                placeholder: "Select type",
                options: transactionTypeOptions,
              },
            ],
          },
          // Dynamic callbacks - API functions
          dynamicCallbacks: isTableFilterDynamic
            ? {
                onSearch: filterApi.search,
                onDateRangeChange: filterApi.filterByDateRange,
                onStatusChange: filterApi.filterByStatus,
                onSelectChange: filterApi.filterBySelect,
                onFilterApply: filterApi.applyFilters,
              }
            : undefined,
        }}
      />
      <div className="flex justify-center sm:justify-start mt-4 gap-3">
        <Button onClick={handleExportToCSV}>Export CSV</Button>
      </div>
    </div>
  );
};

export default CompletedTransactionTable;
