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
import { usePageTitle } from "@/hooks/usePageTitle";
import useGetCheckerOrders from "@/features/checker/hooks/useGetCheckerOrders";
import {
  purposeTypeOptions,
  transactionTypeOptions,
} from "../../config/tableFiltersConfig";

const CompletedTransactionTable = () => {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Completed Transaction");
  }, [setTitle]);

  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

  // Use our custom hook to fetch completed transactions
  const {
    data: checkerOrdersData,
    loading: checkerOrdersLoading,
    error: checkerOrdersError,
    fetchData: refreshData,
  } = useGetCheckerOrders<{
    message: string;
    totalOrders: number;
    filterApplied: string;
    orders: any[];
  }>("completed", true); // Start with "completed" type

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.COMPLETED_TRANSACTIONS.SEARCH_FILTER,
    initialPageSize: 10,
    initialData,
    dataPath: "transactions",
    totalRecordsPath: "totalRecords",
  });

  // Using the filter API hook
  const filterApi = useFilterApi({
    endpoint: API.CHECKER.COMPLETED_TRANSACTIONS.SEARCH_FILTER,
    initialData,
    baseQueryParams: {},
  });

  const columns = getTransactionTableColumns();

  // Transform checker orders data to match the table format
  const transformOrderForTable = (order: any) => {
    return {
      niumId: order.nium_order_id || "N/A",
      orderDate: new Date(order.createdAt).toLocaleString(),
      agentId: order.partner_id || "N/A",
      customerPan: order.customer_pan || "N/A",
      transactionType: order.transaction_type || "N/A",
      purposeType: order.purpose_type || "N/A",
      esignStatus: order.e_sign_status || "N/A",
      esignStatusCompletionDate: order.e_sign_customer_completion_date
        ? new Date(order.e_sign_customer_completion_date).toLocaleString()
        : "N/A",
      vkycStatus: order.v_kyc_status || "N/A",
      vkycCompletionDate: order.v_kyc_customer_completion_date
        ? new Date(order.v_kyc_customer_completion_date).toLocaleString()
        : "N/A",
      incidentStatus: order.incident_status ? "Yes" : "No",
      incidentCompletionDate: order.incident_completion_date
        ? new Date(order.incident_completion_date).toLocaleString()
        : "N/A",
      niumInvoiceNumber: order.nium_invoice_number || "N/A",
    };
  };

  // Get the appropriate data source based on loading state and availability
  const getTableData = () => {
    if (checkerOrdersData && checkerOrdersData.orders) {
      return checkerOrdersData.orders.map(transformOrderForTable);
    }

    // Fallback to other data sources
    if (isPaginationDynamic) {
      return pagination.data;
    } else if (isTableFilterDynamic && filterApi.data.length > 0) {
      return filterApi.data;
    }

    return transactionTableData;
  };

  const handleExportToCSV = () => {
    const dataToExport = getTableData();

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, "completed-transactions");
  };

  // Check for loading and error states
  const isLoading =
    checkerOrdersLoading || filterApi.loading || pagination.loading;
  const hasError = checkerOrdersError || filterApi.error || pagination.error;

  // Get total records
  const totalRecords =
    checkerOrdersData?.totalOrders || pagination.totalRecords || 0;

  return (
    <div className="flex flex-col">
      <DynamicTable
        columns={columns}
        data={getTableData()}
        refreshAction={{
          isRefreshButtonVisible: true,
          onRefresh: refreshData,
          isLoading: isLoading,
          hasError: hasError,
        }}
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        loading={isLoading}
        paginationMode={isPaginationDynamic ? "dynamic" : "static"}
        onPageChange={
          isPaginationDynamic
            ? pagination.handlePageChange
            : async (_page: number, _pageSize: number) => []
        }
        totalRecords={totalRecords}
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

            selects: [
              {
                id: "purposeType",
                label: "Purpose Type",
                placeholder: "---Select---",
                options: purposeTypeOptions,
              },
              {
                id: "transactionType",
                label: "Transaction Type",
                placeholder: "---Select---",
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
