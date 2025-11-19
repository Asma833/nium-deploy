import { useEffect, useState } from 'react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import { Button } from '@/components/ui/button';
import { API } from '@/core/constant/apis';
import { GetTransactionTableColumns } from './ViewAllTableColumns';
import { exportToCSV } from '@/utils/exportUtils';
import { Order, Orders } from '@/features/checker/types/updateIncident.types';
import UpdateIncidentDialog from '@/features/checker/components/update-incident-dialog/UpdateIncidentDialog';
import { useDynamicOptions } from '@/features/checker/hooks/useDynamicOptions';
import { ViewAllTableProps } from '@/components/types/common-components.types';
import { formatDateWithFallback } from '@/utils/formatDateWithFallback';
import { STATUS_MAP, STATUS_TYPES } from '@/core/constant/statusTypes';
import { IncidentMode, IncidentPageId } from '@/types/enums';
import { useGetEKYCStatus } from '@/hooks/useGetEKYCStatus';

const ViewAllTable: React.FC<ViewAllTableProps> = ({
  tableData,
  checkerOrdersLoading,
  checkerOrdersError,
  refreshData,
  disableColumns,
}) => {
  const [selectedRowData, setSelectedRowData] = useState<Orders>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [localTableData, setLocalTableData] = useState<Order[]>([]);

  const { options: purposeTypeOptions } = useDynamicOptions(API.PURPOSE.GET_PURPOSES);
  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_ALL_TRANSACTIONS_TYPES);

  const { data: ekycStatus, isLoading: isEkycLoading, error: ekycError} = useGetEKYCStatus(selectedOrderId, !!selectedOrderId);

  // Sync local table data with prop
  useEffect(() => {
    setLocalTableData(tableData);
  }, [tableData]);

  // Update local table data when ekycStatus is fetched
  useEffect(() => {
    if (ekycStatus && selectedOrderId) {
      setLocalTableData(prevData =>
        prevData.map(row =>
          row.partner_order_id === selectedOrderId
            ? {
                ...row,
                e_sign_status: ekycStatus.status,
                e_sign_customer_completion_date: ekycStatus.data?.completed_at || row.e_sign_customer_completion_date
              }
            : row
        )
      );
    }
  }, [ekycStatus, selectedOrderId]);
  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const isPaginationDynamic = false;

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.VIEW_ALL.SEARCH_FILTER,
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });

  // Transform checker orders data to match the table format
  const transformOrderForTable = (order: any) => {
    return {
      nium_order_id: order.nium_order_id || 'N/A',
      created_at:
        order.created_at === 'N/A' || order.created_at === 'NA' ? 'N/A' : formatDateWithFallback(order.created_at),
      partner_order_id: order.partner_order_id || 'N/A',
      customer_name: order.customer_name || 'N/A',
      customer_pan: order.customer_pan || 'N/A',
      transaction_type_name: order?.transaction_type_name?.name || 'N/A',
      purpose_type_name: order?.purpose_type_name?.purpose_name || 'N/A',
      e_sign_link: order.e_sign_link || null,
      v_kyc_link: order.v_kyc_link || null,
      is_esign_required: order.is_esign_required || 'N/A',
      is_v_kyc_required: order.is_v_kyc_required || 'N/A',
      e_sign_status: order.e_sign_status || null,
      e_sign_customer_completion_date:
        order.e_sign_customer_completion_date === 'N/A' || order.e_sign_customer_completion_date === 'NA'
          ? 'N/A'
          : order.e_sign_customer_completion_date
            ? formatDateWithFallback(order.e_sign_customer_completion_date)
            : 'N/A',
      v_kyc_status: order.v_kyc_status || null,
      v_kyc_customer_completion_date:
        order.v_kyc_customer_completion_date === 'N/A' || order.v_kyc_customer_completion_date === 'NA'
          ? 'N/A'
          : order.v_kyc_customer_completion_date
            ? formatDateWithFallback(order.v_kyc_customer_completion_date)
            : 'N/A',
      order_status: STATUS_MAP[order.order_status] || STATUS_TYPES.NA,
      incident_completion_date:
        order.incident_completion_date === 'N/A' || order.incident_completion_date === 'NA'
          ? 'N/A'
          : order.incident_completion_date
            ? formatDateWithFallback(order.incident_completion_date)
            : 'N/A',
    };
  };
  const handleExportToCSV = () => {
    // Use filtered data if available, otherwise fall back to all data
    const dataToExport =
      filteredData.length > 0
        ? filteredData.map((item) => transformOrderForTable(item))
        : localTableData.map((item) => transformOrderForTable(item)) || [];

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, 'view-all');
  };

  // Check for loading and error states
  const isLoading = checkerOrdersLoading || pagination.loading;
  const hasError = checkerOrdersError || pagination.error;
  const handleEkycStatus = (rowData: Order) => {
    const orderId = rowData.partner_order_id;
    if (orderId && orderId !== 'N/A' && typeof orderId === 'string' && orderId.trim() !== '') {
      setSelectedOrderId(orderId);
      // The query will automatically refetch when selectedOrderId changes due to enabled: !!selectedOrderId
    }
  };
  const columns = GetTransactionTableColumns({
    openModal,
    handleEkycStatus
  });

  const tableColumns = columns.filter((col) => !disableColumns?.includes(col.id as string));

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="dynamic-table-wrap">
      {' '}
      <DynamicTable
        columns={tableColumns}
        data={localTableData}
        loading={isLoading}
        refreshAction={{
          isRefreshButtonVisible: true,
          onRefresh: refreshData,
          isLoading: isLoading,
          hasError: hasError,
        }}
        paginationMode={'static'}
        onPageChange={
          isPaginationDynamic ? pagination.handlePageChange : async (_page: number, _pageSize: number) => []
        }
        onFilteredDataChange={setFilteredData}
        filter={{
          filterOption: true,
          mode: 'static',
          dateFilterColumn: 'created_at',
          renderFilterOptions: {
            search: true,
            dateRange: true,
            applyAction: true,
            resetAction: true,
            selects: [
              {
                id: 'purpose_type_name.purpose_name',
                label: 'Purpose Type',
                placeholder: 'Select',
                options: purposeTypeOptions,
              },
              {
                id: 'transaction_type_name.name',
                label: 'Transaction Type',
                placeholder: 'Select',
                options: transactionTypeOptions,
              },
            ],
          },
        }}
      />
      <div className="flex justify-center sm:justify-start mt-4 gap-3">
        <Button onClick={handleExportToCSV}>Export CSV</Button>
      </div>
      {isModalOpen && selectedRowData && (
        <UpdateIncidentDialog
          pageId={IncidentPageId.VIEW_ALL}
          mode={IncidentMode.VIEW}
          selectedRowData={selectedRowData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ViewAllTable;
