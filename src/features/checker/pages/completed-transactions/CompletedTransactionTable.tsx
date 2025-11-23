import { useMemo, useState } from 'react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { Button } from '@/components/ui/button';
import { GetTransactionTableColumns } from './CompletedTransactionTableColumns';
import { exportToCSV } from '@/utils/exportUtils';
import useGetCheckerOrders from '@/features/checker/hooks/useGetCheckerOrders';
import { API } from '@/core/constant/apis';
import UpdateIncidentDialog from '../../components/update-incident-dialog/UpdateIncidentDialog';
import { useDynamicOptions } from '../../hooks/useDynamicOptions';
import { Order } from '../../types/updateIncident.types';
import { formatDate } from '@/utils/dateFormat';
import { formatDateWithFallback } from '@/utils/formatDateWithFallback';
import { STATUS_MAP, STATUS_TYPES } from '@/core/constant/statusTypes';
import { IncidentMode, IncidentPageId, TransactionTypeEnum } from '@/types/enums';
import { maskPAN } from '@/utils/masking';

const CompletedTransactionTable = () => {
  const {
    data: checkerOrdersData,
    loading: checkerOrdersLoading,
    error: checkerOrdersError,
    fetchData: refreshData,
  } = useGetCheckerOrders(TransactionTypeEnum.COMPLETED, true);

  const tableData = useMemo(() => {
    if (!checkerOrdersData) return [];

    // More robust order validation function
    const isValidOrder = (item: any): item is Order => {
      return (
        !!item &&
        typeof item === 'object' &&
        // Check for essential order properties - be more flexible with created_at
        (item.nium_order_id || item.partner_order_id || item.customer_pan)
      );
    };

    let result: Order[] = [];

    // If already an array
    if (Array.isArray(checkerOrdersData)) {
      result = (checkerOrdersData as Order[]).filter(isValidOrder);
    }
    // If object with 'orders' property
    else if (typeof checkerOrdersData === 'object' && 'orders' in checkerOrdersData) {
      const orders = (checkerOrdersData as any).orders;
      if (Array.isArray(orders)) {
        result = orders.filter(isValidOrder);
      } else if (orders && typeof orders === 'object') {
        result = Object.values(orders).filter(isValidOrder);
      }
    }
    // If object of objects
    else if (typeof checkerOrdersData === 'object') {
      result = Object.values(checkerOrdersData).filter(isValidOrder);
    }
    return result;
  }, [checkerOrdersData]);

  // Format error message consistently
  const errorMessage = useMemo(() => {
    if (!checkerOrdersError) return '';

    if (typeof checkerOrdersError === 'string') {
      return checkerOrdersError;
    }

    if (checkerOrdersError && typeof checkerOrdersError === 'object' && 'message' in checkerOrdersError) {
      return (checkerOrdersError as Error).message;
    }

    return 'An unexpected error occurred';
  }, [checkerOrdersError]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };
  const columns = GetTransactionTableColumns(openModal);
  const { options: purposeTypeOptions } = useDynamicOptions(API.PURPOSE.GET_PURPOSES);

  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_ALL_TRANSACTIONS_TYPES);

  // Transform checker orders data to match the table format
  const transformOrderForTable = (order: any) => {
    return {
      nium_order_id: order.nium_order_id || '',
      created_at:
        order.created_at === 'N/A' || order.created_at === 'NA' ? 'N/A' : formatDateWithFallback(order.created_at),
      partner_order_id: order.partner_order_id || '',
      customer_name: order.customer_name || '',
      customer_pan: maskPAN(order.customer_pan) || '',
      transaction_type_name: order?.transaction_type_name?.name || '',
      purpose_type_name: order?.purpose_type_name?.purpose_name || '',
      is_esign_required: order.is_esign_required || '',
      is_v_kyc_required: order.is_v_kyc_required || '',
      e_sign_status: order.e_sign_status || null,
      e_sign_customer_completion_date:
        order.e_sign_customer_completion_date === 'N/A' || order.e_sign_customer_completion_date === 'NA'
          ? 'N/A'
          : formatDateWithFallback(order.e_sign_customer_completion_date),
      v_kyc_status: order.v_kyc_status || null,
      v_kyc_customer_completion_date:
        order.v_kyc_customer_completion_date === 'N/A' || order.v_kyc_customer_completion_date === 'NA'
          ? 'N/A'
          : formatDateWithFallback(order.v_kyc_customer_completion_date),
      order_status: order.order_status,
      incident_completion_date:
        order.incident_completion_date === 'N/A' || order.incident_completion_date === 'NA'
          ? 'N/A'
          : order.incident_completion_date,
      nium_invoice_number: order.nium_invoice_number || '',
    };
  };
  // Get data directly from checker orders data

  const getTableData = () => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      return tableData.map(transformOrderForTable);
    }
    return [];
  };

  const handleExportToCSV = () => {
    // Use filtered data if available, otherwise fall back to all data
    const dataToExport = filteredData.length > 0 ? filteredData : getTableData();

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, 'completed-transactions');
  };
  // Check for loading and error states
  const isLoading = checkerOrdersLoading;
  const hasError = !!errorMessage; // Get total records
  const totalRecords = (() => {
    if (!checkerOrdersData) return 0;

    // If it's an array, use its length
    if (Array.isArray(checkerOrdersData)) {
      return checkerOrdersData.length;
    }

    // If it has a totalOrders property, use that
    if (checkerOrdersData.totalOrders !== undefined) {
      return checkerOrdersData.totalOrders;
    }

    // If it has an orders array, use its length
    if (checkerOrdersData.orders && Array.isArray(checkerOrdersData.orders)) {
      return checkerOrdersData.orders.length;
    }

    return 0;
  })();

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
        loading={isLoading}
        paginationMode="static"
        totalRecords={totalRecords}
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
      </div>{' '}
      {isModalOpen && (
        <UpdateIncidentDialog
          pageId={IncidentPageId.COMPLETED}
          mode={IncidentMode.EDIT_INVOICE}
          selectedRowData={selectedRowData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default CompletedTransactionTable;
