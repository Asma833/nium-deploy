import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { GetAssignCreationColumns } from './AssignCreationTableColumns';
import { useFilterApi } from '@/components/common/dynamic-table/hooks/useFilterApi';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import { Button } from '@/components/ui/button';
import { API } from '@/core/constant/apis';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { useGetData } from '@/hooks/useGetData';
import { useQueryInvalidator } from '@/hooks/useQueryInvalidator';
import UpdateIncidentDialog from '@/features/checker/components/update-incident-dialog/UpdateIncidentDialog';
import { useDynamicOptions } from '@/features/checker/hooks/useDynamicOptions';
import { IncidentMode, IncidentPageId } from '@/types/enums';

const AssignCreationTable = () => {
  const { invalidateMultipleQueries } = useQueryInvalidator();
  const { getUserHashedKey } = useCurrentUser();
  const currentUserHashedKey = getUserHashedKey();
  const { options: purposeTypeOptions } = useDynamicOptions(API.PURPOSE.GET_PURPOSES);

  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_ALL_TRANSACTIONS_TYPES);

  const { data, isLoading, error, refetch } = useGetData({
    endpoint: API.CHECKER.ASSIGN.LIST,
    queryKey: ['getAssignList'],
  });
  const formateDataArray = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data.filter((item) => item != null);
    }

    // If data is an object, extract values and ensure they form a proper array
    if (typeof data === 'object' && data !== null) {
      // const values = Object.values(data as Record<string, any>);
      return (
        Object.values(data)
          .flat()
          .filter((item) => item != null) || []
      );
    }

    return [];
  }, [data]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  }; // Update tableData when data changes
  useEffect(() => {
    if (data) {
      setTableData(formateDataArray);
    }
  }, [formateDataArray]);

  // Display error toast if API request fails
  useEffect(() => {
    if (error) {
      toast.error('Failed to load assign list. Please try again.');
    }
  }, [error]);

  // Use the dynamic pagination hook
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.ASSIGN.LIST,
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });

  // Using the filter API hook
  const filterApi = useFilterApi({
    endpoint: API.CHECKER.ASSIGN.LIST,
    baseQueryParams: {},
  });

  const handleSelectionChange = (rowId: string, checked: boolean) => {
    // Update the selected rows array
    setSelectedRows((prev) => {
      if (checked) {
        return [...prev, rowId];
      } else {
        return prev.filter((id) => id !== rowId);
      }
    }); // Also update the tableData to reflect the checked state
    setTableData((prevData) =>
      Array.isArray(prevData)
        ? prevData.map((row: any) => (row.partner_order_id === rowId ? { ...row, select: checked } : row))
        : []
    );
  };

  const handleTakeRequest = async () => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one transaction');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(API.CHECKER.ASSIGN.TAKE_REQUEST, {
        orderIds: selectedRows,
        checkerId: currentUserHashedKey,
      }); // Handle successful response
      if (response) {
        toast.success(`Successfully assigned ${selectedRows.length} transaction(s)`);
        await invalidateMultipleQueries([['getAssignList'], ['dashboardMetrics'], ['checkerOrders']]);
      }

      setSelectedRows([]);
    } catch (error) {
      toast.error('Failed to take request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = GetAssignCreationColumns(handleSelectionChange, openModal, selectedRows);

  return (
    <div className="dynamic-table-wrap flex flex-col">
      <DynamicTable
        columns={columns}
        data={formateDataArray || []}
        defaultSortColumn=""
        loading={isLoading}
        paginationMode={isPaginationDynamic ? 'dynamic' : 'static'}
        refreshAction={{
          isRefreshButtonVisible: true,
          onRefresh: async () => {
            if (refetch) {
              await refetch();
            }
            setSelectedRows([]);
          },
          isLoading: isLoading,
          hasError: error,
        }}
        onPageChange={
          isPaginationDynamic ? pagination.handlePageChange : async (_page: number, _pageSize: number) => []
        }
        totalRecords={pagination.totalRecords}
        filter={{
          filterOption: true,
          mode: isTableFilterDynamic ? 'dynamic' : 'static',
          renderFilterOptions: {
            search: true,
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

          // Dynamic callbacks - API functions
          dynamicCallbacks: isTableFilterDynamic
            ? {
                onSearch: filterApi.search,
              }
            : undefined,
        }}
      />

      <div className="w-full flex flex-col items-center justify-start gap-3">
        <div className="text-sm text-gray-500">
          {selectedRows.length} transaction
          {selectedRows.length !== 1 ? 's' : ''} selected
        </div>
        <Button onClick={handleTakeRequest} disabled={selectedRows.length === 0 || isSubmitting} className="border">
          {isSubmitting ? 'Processing...' : `Take Request${selectedRows.length !== 1 ? 's' : ''}`}
        </Button>
      </div>
      {isModalOpen && (
        <UpdateIncidentDialog
          pageId={IncidentPageId.COMPLETED}
          mode={IncidentMode.VIEW}
          selectedRowData={selectedRowData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default AssignCreationTable;
