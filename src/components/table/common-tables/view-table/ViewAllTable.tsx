import { useState } from 'react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import { Button } from '@/components/ui/button';
import { API } from '@/core/constant/apis';
import { GetTransactionTableColumns } from './ViewAllTableColumns';
import { exportToCSV } from '@/utils/exportUtils';
import { useSendEsignLink } from '@/features/checker/hooks/useSendEsignLink';
import { IncidentMode, IncidentPageId, Order, Orders } from '@/features/checker/types/updateIncident.types';
import UpdateIncidentDialog from '@/features/checker/components/update-incident-dialog/UpdateIncidentDialog';
import { useDynamicOptions } from '@/features/checker/hooks/useDynamicOptions';
import { ViewAllTableProps } from '@/components/types/common-components.types';

const ViewAllTable: React.FC<ViewAllTableProps> = ({
  tableData,
  checkerOrdersLoading,
  checkerOrdersError,
  refreshData,
  disableColumns,
}) => {
  const [loadingOrderId, setLoadingOrderId] = useState<string>('');
  const { mutate: sendEsignLink, isSendEsignLinkLoading } = useSendEsignLink();
  const [selectedRowData, setSelectedRowData] = useState<Orders>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<Order[]>([]);

  const { options: purposeTypeOptions } = useDynamicOptions(API.PURPOSE.GET_PURPOSES);

  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_TRANSACTIONS);

  const handleRegenerateEsignLink = (rowData: Order): void => {
    if (rowData.nium_order_id) {
      setLoadingOrderId(rowData.nium_order_id);
    }
    sendEsignLink(
      { partner_order_id: rowData.partner_order_id || '' },
      {
        onSuccess: () => {
          setLoadingOrderId('');
        },
        onError: () => {
          setLoadingOrderId('');
        },
      }
    );
  };

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
        order.created_at === 'N/A' || order.created_at === 'NA' ? 'N/A' : new Date(order.created_at).toLocaleString(),
      partner_id: order.partner_id || 'N/A',
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
            ? new Date(order.e_sign_customer_completion_date).toLocaleString()
            : 'N/A',
      v_kyc_status: order.v_kyc_status || null,
      v_kyc_customer_completion_date:
        order.v_kyc_customer_completion_date === 'N/A' || order.v_kyc_customer_completion_date === 'NA'
          ? 'N/A'
          : order.v_kyc_customer_completion_date
            ? new Date(order.v_kyc_customer_completion_date).toLocaleString()
            : 'N/A',
      incident_status: order.incident_status ? 'Approved' : !order.incident_status ? 'Rejected' : 'Pending',
      incident_completion_date:
        order.incident_completion_date === 'N/A' || order.incident_completion_date === 'NA'
          ? 'N/A'
          : order.incident_completion_date
            ? new Date(order.incident_completion_date).toLocaleString()
            : 'N/A',
    };
  };
  const handleExportToCSV = () => {
    // Use filtered data if available, otherwise fall back to all data
    const dataToExport =
      filteredData.length > 0
        ? filteredData.map((item) => transformOrderForTable(item))
        : tableData.map((item) => transformOrderForTable(item)) || [];

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

  const columns = GetTransactionTableColumns({
    handleRegenerateEsignLink,
    isSendEsignLinkLoading,
    loadingOrderId,
    openModal,
  });

  const tableColumns = columns.filter((col) => !disableColumns?.includes(col.id as string));
  return (
    <div className="dynamic-table-wrap">
      {' '}
      <DynamicTable
        columns={tableColumns}
        data={tableData}
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
