import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { getAssignCreationColumns } from './assign-creation-table-col';
import { useState, useEffect } from 'react';
import { useFilterApi } from '@/components/common/dynamic-table/hooks/useFilterApi';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { API } from '@/core/constant/apis';
import { usePageTitle } from '@/hooks/usePageTitle';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { useGetData } from '@/hooks/useGetData';
import { useQueryInvalidation, QUERY_KEYS } from '@/hooks/useQueryInvalidation';

const AssignCreationTable = () => {
  const { invalidateQueries } = useQueryInvalidation();
  const { setTitle } = usePageTitle();
  const { getUserHashedKey } = useCurrentUser();
  const currentUserHashedKey = getUserHashedKey();

  useEffect(() => {
    setTitle('Assign');
  }, [setTitle]);

  const { data, isLoading, error } = useGetData<any[]>({
    endpoint: API.CHECKER.ASSIGN.LIST,
    queryKey: ['getAssignList'],
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

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
    });
  };

  const handleTakeRequest = async () => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one transaction');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        API.CHECKER.ASSIGN.TAKE_REQUEST,
        {
          orderIds: selectedRows,
          checkerId: currentUserHashedKey,
        }
      );

      // Handle successful response
      if (response) {
        toast.success(
          `Successfully assigned ${selectedRows.length} transaction(s)`
        );
        await invalidateQueries([...QUERY_KEYS.ASSIGN_LIST]);
      }

      setSelectedRows([]);
    } catch (error) {
      toast.error('Failed to take request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = getAssignCreationColumns(handleSelectionChange);

  return (
    <div className="flex flex-col">
      <DynamicTable
        columns={columns}
        data={data || []}
        defaultSortColumn="nium_order_id"
        defaultSortDirection="asc"
        loading={isLoading}
        paginationMode={isPaginationDynamic ? 'dynamic' : 'static'}
        onPageChange={
          isPaginationDynamic
            ? pagination.handlePageChange
            : async (_page: number, _pageSize: number) => []
        }
        totalRecords={pagination.totalRecords}
        filter={{
          filterOption: true,
          mode: isTableFilterDynamic ? 'dynamic' : 'static',
          renderFilterOptions: {
            search: true,
          },
          // Dynamic callbacks - API functions
          dynamicCallbacks: isTableFilterDynamic
            ? {
                onSearch: filterApi.search,
              }
            : undefined,
        }}
      />

      <div className="w-full  flex flex-col items-center justify-start gap-3">
        <div className="text-sm text-gray-500">
          {selectedRows.length} transaction
          {selectedRows.length !== 1 ? 's' : ''} selected
        </div>
        <Button
          onClick={handleTakeRequest}
          disabled={selectedRows.length === 0 || isSubmitting}
          className="border"
        >
          {isSubmitting
            ? 'Processing...'
            : `Take Request${selectedRows.length !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
};

export default AssignCreationTable;
