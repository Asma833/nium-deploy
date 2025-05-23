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
import { useSendEsignLink } from '@/features/checker/hooks/useSendEsignLink';
import { Order, Orders } from '@/features/checker/types/updateIncident.type';
import { useState } from 'react';
import UpdateIncidentDialog from '@/features/checker/components/update-incident-dialog/UpdateIncidentDialog';

const ViewAllTable = () => {
  usePageTitle('View All');
  const [loadingOrderId, setLoadingOrderId] = useState<string>('');
  const { mutate: sendEsignLink, isSendEsignLinkLoading } = useSendEsignLink();
  const [selectedRowData, setSelectedRowData] = useState<Orders>();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      nium_order_id: order.nium_order_id || '-',
      created_at: new Date(order.created_at).toLocaleString(),
      partner_id: order.partner_id || '-',
      partner_order_id: order.partner_order_id || '-',
      customer_pan: order.customer_pan || '-',
      transaction_type_name: order?.transaction_type_name || '-',
      purpose_type_name: order?.purpose_type_name || '-',
      is_esign_required: order.is_esign_required || '-',
      is_v_kyc_required: order.is_v_kyc_required || '-',
      e_sign_status: order.e_sign_status || '-',
      e_sign_customer_completion_date: order.e_sign_customer_completion_date
        ? new Date(order.e_sign_customer_completion_date).toLocaleString()
        : '-',
      v_kyc_status: order.v_kyc_status || '-',
      v_kyc_customer_completion_date: order.v_kyc_customer_completion_date
        ? new Date(order.v_kyc_customer_completion_date).toLocaleString()
        : '-',
      incident_status: order.incident_status,
      incident_completion_date: order.incident_completion_date
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

  const columns = GetTransactionTableColumns({
    handleRegenerateEsignLink,
    isSendEsignLinkLoading,
    loadingOrderId,
    openModal,
  });

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
          dateFilterColumn: 'created_at',
          renderFilterOptions: {
            search: true,
            dateRange: true,
            applyAction: true,
            resetAction: true,
            selects: [
              {
                id: 'purpose_type_name',
                label: 'Purpose Type',
                placeholder: 'Select',
                options: purposeTypeOptions,
              },
              {
                id: 'transaction_type_name',
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
          pageId="viewAllIncident"
          mode="view"
          selectedRowData={selectedRowData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ViewAllTable;
