import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getTransactionTableColumns } from './completed-transaction-table-col';
import { exportToCSV } from '@/utils/exportUtils';
import { usePageTitle } from '@/hooks/usePageTitle';
import useGetCheckerOrders from '@/features/checker/hooks/useGetCheckerOrders';
import {
  purposeTypeOptions,
  transactionTypeOptions,
} from '../../config/table-filter.config';

const CompletedTransactionTable = () => {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle('Completed Transaction');
  }, [setTitle]);

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

  const columns = getTransactionTableColumns();

  // Transform checker orders data to match the table format
  const transformOrderForTable = (order: any) => {
    return {
      niumId: order.nium_order_id || 'N/A',
      orderDate: new Date(order.createdAt).toLocaleString(),
      agentId: order.partner_id || 'N/A',
      customerPan: order.customer_pan || 'N/A',
      transactionType: order.transaction_type.text || 'N/A',
      purposeType: order.purpose_type.text || 'N/A',
      esignStatus: order.e_sign_status || 'N/A',
      esignStatusCompletionDate: order.e_sign_customer_completion_date
        ? new Date(order.e_sign_customer_completion_date).toLocaleString()
        : 'N/A',
      vkycStatus: order.v_kyc_status || 'N/A',
      vkycCompletionDate: order.v_kyc_customer_completion_date
        ? new Date(order.v_kyc_customer_completion_date).toLocaleString()
        : 'N/A',
      incidentStatus: order.incident_status ? 'Yes' : 'No',
      incidentCompletionDate: order.incident_completion_date
        ? new Date(order.incident_completion_date).toLocaleString()
        : 'N/A',
      niumInvoiceNumber: order.nium_invoice_number || 'N/A',
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
        paginationMode="static"
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
                placeholder: '---Select---',
                options: purposeTypeOptions,
              },
              {
                id: 'transactionType',
                label: 'Transaction Type',
                placeholder: '---Select---',
                options: transactionTypeOptions,
              },
            ],
          },
        }}
      />
      <div className="flex justify-center sm:justify-start mt-4 gap-3">
        <Button onClick={handleExportToCSV}>Export CSV</Button>
      </div>
    </div>
  );
};

export default CompletedTransactionTable;
