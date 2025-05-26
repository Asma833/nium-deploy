import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { Button } from '@/components/ui/button';
import { GetTransactionTableColumns } from './CompletedTransactionTableColumns';
import { exportToCSV } from '@/utils/exportUtils';
import { usePageTitle } from '@/hooks/usePageTitle';
import useGetCheckerOrders from '@/features/checker/hooks/useGetCheckerOrders';
import { useState } from 'react';
import UpdateIncidentDialog from '../../components/update-incident-dialog/UpdateIncidentDialog';
import { useDynamicOptions } from '../../hooks/useDynamicOptions';
import { API } from '@/core/constant/apis';

const CompletedTransactionTable = () => {
  usePageTitle('Completed Transaction');

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
  }>('completed', true); // Start with "completed" type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };
  const columns = GetTransactionTableColumns(openModal);
 const {
    options: purposeTypeOptions,
  } = useDynamicOptions(API.PURPOSE.GET_PURPOSES);

  const {
    options: transactionTypeOptions,
  } = useDynamicOptions(API.TRANSACTION.GET_TRANSACTIONS);
 
  // Transform checker orders data to match the table format
  const transformOrderForTable = (order: any) => {
    return {
      nium_order_id: order.nium_order_id || '-',
      created_at: new Date(order.created_at).toLocaleString(),
      partner_id: order.partner_id || '-',
      partner_order_id: order.partner_order_id || '-',
      customer_pan: order.customer_pan || '-',
      transaction_type_name: order?.transaction_type_name?.name || '-',
      purpose_type_name: order?.purpose_type_name?.purpose_name || '-',
      is_esign_required: order.is_esign_required || '-',
      is_v_kyc_required: order.is_v_kyc_required || '-',
      e_sign_status: order.e_sign_status || null,
      e_sign_customer_completion_date: order.e_sign_customer_completion_date
        ? new Date(order.e_sign_customer_completion_date).toLocaleString()
        : '-',
      v_kyc_status: order.v_kyc_status || null,
      v_kyc_customer_completion_date: order.v_kyc_customer_completion_date
        ? new Date(order.v_kyc_customer_completion_date).toLocaleString()
        : '-',
      incident_status: order.incident_status,
      incident_completion_date: order.incident_completion_date
        ? new Date(order.incident_completion_date).toLocaleString()
        : '-',
      nium_invoice_number: order.nium_invoice_number || '-',
    };
  };

  // Get data directly from checker orders data
  const getTableData = () => {
    if (checkerOrdersData && checkerOrdersData.orders) {
      return checkerOrdersData.orders.map(transformOrderForTable);
    }

    return [];
  };

  const handleExportToCSV = () => {
    const dataToExport = getTableData();

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, 'completed-transactions');
  };

  // Check for loading and error states
  const isLoading = checkerOrdersLoading;
  const hasError = checkerOrdersError;

  // Get total records
  const totalRecords = checkerOrdersData?.totalOrders || 0;

  return (
    <div className="dynamic-table-wrap">
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
        paginationMode="static"
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
        }}
      />
      <div className="flex justify-center sm:justify-start mt-4 gap-3">
        <Button onClick={handleExportToCSV}>Export CSV</Button>
      </div>
      {isModalOpen && (
        <UpdateIncidentDialog
          pageId="completedIncident"
          mode="view"
          selectedRowData={selectedRowData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default CompletedTransactionTable;
