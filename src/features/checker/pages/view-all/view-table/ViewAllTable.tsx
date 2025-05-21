import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import { Button } from '@/components/ui/button';
import { API } from '@/core/constant/apis';
import { GetTransactionTableColumns } from './ViewAllTableColumns';
import { exportToCSV } from '@/utils/exportUtils';
import { usePageTitle } from '@/hooks/usePageTitle';
import useGetCheckerOrders from '@/features/checker/hooks/useGetCheckerOrders';
import {
  purposeTypeOptions,
  transactionTypeOptions,
} from '@/features/checker/config/table-filter.config';

const ViewAllTable = () => {
  usePageTitle('View All');

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
  }>('all', true);

  const isPaginationDynamic = false;

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.VIEW_ALL.SEARCH_FILTER,
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });

  const columns = GetTransactionTableColumns();

  // Transform checker orders data to match the table format
  const transformOrderForTable = (order: any) => {
    return {
      niumId: order.nium_order_id || '-',
      orderDate: new Date(order.createdAt).toLocaleString(),
      agentId: order.partner_id || '-',
      customerPan: order.customer_pan || '-',
      transactionType: order?.transaction_type_name?.name || '-',
      purposeType: order?.purpose_type_name?.purpose_name || '-',
      esignStatus: order.e_sign_status || '-',
      esignStatusCompletionDate: order.e_sign_customer_completion_date
        ? new Date(order.e_sign_customer_completion_date).toLocaleString()
        : '-',
      vkycStatus: order.v_kyc_status || '-',
      vkycCompletionDate: order.v_kyc_customer_completion_date
        ? new Date(order.v_kyc_customer_completion_date).toLocaleString()
        : '-',
      incidentStatus: order.incident_status,
      incidentCompletionDate: order.incident_completion_date
        ? new Date(order.incident_completion_date).toLocaleString()
        : '-',
    };
  };

  const handleExportToCSV = () => {
    const dataToExport =
      checkerOrdersData?.orders?.map(transformOrderForTable) || [];

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, 'view-all');
  };

  // Check for loading and error states
  const isLoading = checkerOrdersLoading || pagination.loading;
  const hasError = checkerOrdersError || pagination.error;
  // const isLoading =
  //   checkerOrdersLoading || filterApi.loading || pagination.loading;
  // const hasError = checkerOrdersError || filterApi.error || pagination.error;

  // Get total records
  const totalRecords =
    checkerOrdersData?.totalOrders || pagination.totalRecords || 0;

  return (
    <div className="dynamic-table-wrap">
      <DynamicTable
        columns={columns}
        data={checkerOrdersData?.orders?.map(transformOrderForTable) || []}
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        loading={isLoading}
        refreshAction={{
          isRefreshButtonVisible: true,
          onRefresh: refreshData,
          isLoading: isLoading,
          hasError: hasError,
        }}
        paginationMode={'static'}
        onPageChange={
          isPaginationDynamic
            ? pagination.handlePageChange
            : async (_page: number, _pageSize: number) => []
        }
        totalRecords={totalRecords}
        filter={{
          filterOption: true,
          mode: 'static',
          dateFilterColumn: 'orderDate',
          statusFilerColumn: 'status',
          roleFilerColumn: 'role',
          renderFilterOptions: {
            search: true,
            dateRange: true,
            applyAction: true,
            resetAction: true,
            selects: [
              {
                id: 'purposeType',
                label: 'Purpose Type',
                placeholder: 'Select',
                options: purposeTypeOptions,
              },
              {
                id: 'transactionType',
                label: 'Transaction Type',
                placeholder: 'Select',
                options: transactionTypeOptions,
              },
            ],
          },
          // Dynamic callbacks - API functions
          // dynamicCallbacks: isTableFilterDynamic
          //   ? {
          //       onSearch: filterApi.search,
          //       onDateRangeChange: filterApi.filterByDateRange,
          //       onStatusChange: filterApi.filterByStatus,
          //       onSelectChange: filterApi.filterBySelect,
          //       onFilterApply: filterApi.applyFilters,
          //     }
          //   : undefined,
        }}
      />
      <div className="flex justify-center sm:justify-start mt-4 gap-3">
        <Button onClick={handleExportToCSV}>Export CSV</Button>
      </div>
    </div>
  );
};

export default ViewAllTable;
