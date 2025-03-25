import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { useEffect } from "react";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { Button } from "@/components/ui/button";
import { API } from "@/core/constant/apis";
import { getTransactionTableColumns } from "./view-all-table-col";
import { exportToCSV } from "@/utils/exportUtils";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  purposeTypeOptions,
  transactionTypeOptions,
} from "@/features/checker/config/tableFiltersConfig";
import useGetAllOrders from "@/features/co-admin/hooks/useGetAllOrders";

const ViewAllTable = () => {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("View All");
  }, [setTitle]);

  const {
    data: viewAllData,
    loading: viewAllLoading,
    error: viewAllError,
    fetchData: refreshData,
  } = useGetAllOrders();

  console.log("checkerOrdersData", viewAllData);

  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.VIEW_ALL.SEARCH_FILTER,
    initialPageSize: 10,
    dataPath: "transactions",
    totalRecordsPath: "totalRecords",
  });

  const filterApi = useFilterApi({
    endpoint: API.CHECKER.VIEW_ALL.SEARCH_FILTER,
    baseQueryParams: {},
  });

  const columns = getTransactionTableColumns();

  // Transform checker orders data to match the table format
  const transformOrderForTable = (order: any) => {
    return {
      niumId: order.nium_order_id || "-",
      orderDate: new Date(order.createdAt).toLocaleString(),
      agentId: order.partner_id || "-",
      customerPan: order.customer_pan || "-",
      transactionType: order.transaction_type.text || "-",
      purposeType: order.purpose_type.text || "-",
      esignStatus: order.e_sign_status || "-",
      esignStatusCompletionDate: order.e_sign_customer_completion_date
        ? new Date(order.e_sign_customer_completion_date).toLocaleString()
        : "-",
      vkycStatus: order.v_kyc_status || "-",
      vkycCompletionDate: order.v_kyc_customer_completion_date
        ? new Date(order.v_kyc_customer_completion_date).toLocaleString()
        : "-",
      incidentStatus: order.incident_status ? "Yes" : "No",
      incidentCompletionDate: order.incident_completion_date
        ? new Date(order.incident_completion_date).toLocaleString()
        : "-",
    };
  };

  // Get the appropriate data source based on loading state and availability
  const getTableData = () => {
    if (viewAllData && viewAllData.orders) {
      return viewAllData.orders.map(transformOrderForTable);
    }

    // Fallback to other data sources
    if (isPaginationDynamic) {
      return pagination.data;
    } else if (isTableFilterDynamic && filterApi.data.length > 0) {
      return filterApi.data;
    }

    return [];
  };

  const handleExportToCSV = () => {
    const dataToExport = getTableData();

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, "view-all");
  };

  // Check for loading and error states
  const isLoading = viewAllLoading || filterApi.loading || pagination.loading;
  const hasError = viewAllError || filterApi.error || pagination.error;

  // Get total records
  const totalRecords = viewAllData?.totalOrders || pagination.totalRecords || 0;

  return (
    <div className="flex flex-col">
      <DynamicTable
        columns={columns}
        data={viewAllData}
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        loading={isLoading}
        refreshAction={{
          isRefreshButtonVisible: true,
          onRefresh: refreshData,
          isLoading: isLoading,
          hasError: hasError,
        }}
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

export default ViewAllTable;
