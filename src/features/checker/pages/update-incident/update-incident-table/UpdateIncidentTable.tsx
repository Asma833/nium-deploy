import { useState } from 'react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import { useFilterApi } from '@/components/common/dynamic-table/hooks/useFilterApi';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import useUnassignChecker from '@/features/checker/hooks/useUnassignChecker';
import { cn } from '@/utils/cn';
import { GetTransactionTableColumns } from './UpdateIncidentTableColumns';
import { useGetUpdateIncident } from '../../../hooks/useGetUpdate';
import {
  IncidentMode,
  IncidentPageId,
  Order,
} from '@/features/checker/types/updateIncident.types';
import UpdateIncidentDialog from '@/features/checker/components/update-incident-dialog/UpdateIncidentDialog';

const UpdateIncidentCreationTable = () => {
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getUserHashedKey, getUserId } = useCurrentUser();
  const currentUserHashedKey = getUserHashedKey();
  const roleId = getUserId();

  // Call the hook at the top level of the component
  const { handleUnassign: unassignChecker, isPending: isUnassignPending } =
    useUnassignChecker();

  const requestData = {
    checkerId: roleId || '',
    transaction_type: 'pending',
  };

  // Fetch data using the updated hook
  const { data, isLoading, error, refetch } = useGetUpdateIncident(requestData);

  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

  // Use the dynamic pagination hook
  const pagination = useDynamicPagination({
    endpoint: '',
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });

  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const filterApi = useFilterApi({
    endpoint: '',
    baseQueryParams: {},
  });

  const handleUnassign = (rowData: Order): void => {
    if (currentUserHashedKey && rowData.partner_order_id) {
      unassignChecker(rowData.partner_order_id, currentUserHashedKey);
    }
  };

  const columns = GetTransactionTableColumns(
    openModal,
    handleUnassign,
    isUnassignPending
  );
  const tableData =
    data && data.orders && data.orders.length > 0 ? data.orders : [];

  return (
    <div className="dynamic-table-wrap">
      <div
        className={cn(
          'mb-4 flex items-center',
          !filterApi.loading ? 'hidden' : '',
          !filterApi.error ? 'hidden' : ''
        )}
      >
        {(filterApi.loading || pagination.loading || isLoading) && (
          <span className="text-blue-500">Loading data...</span>
        )}
        {(filterApi.error || pagination.error || error) && (
          <span className="text-red-500">Error loading data</span>
        )}
      </div>{' '}
      <DynamicTable
        columns={columns}
        data={tableData}
        defaultSortColumn="nium_order_id"
        defaultSortDirection="asc"
        loading={pagination.loading}
        paginationMode={isPaginationDynamic ? 'dynamic' : 'static'}
        onPageChange={
          isPaginationDynamic
            ? pagination.handlePageChange
            : async (_page: number, _pageSize: number) => []
        }
        totalRecords={pagination.totalRecords}
        refreshAction={{
          isRefreshButtonVisible: true,
          onRefresh: refetch,
          isLoading: isLoading,
          hasError: error,
        }}
        filter={{
          filterOption: true,
          dateFilterColumn: 'created_at',
          mode: isTableFilterDynamic ? 'dynamic' : 'static',
          renderFilterOptions: {
            search: true,
            dateRange: true,
            applyAction: true,
            resetAction: true,
          },
          // Dynamic callbacks - API functions
          dynamicCallbacks: isTableFilterDynamic
            ? {
                onSearch: filterApi.search,
              }
            : undefined,
        }}
      />
      {isModalOpen && (
        <UpdateIncidentDialog
          pageId={IncidentPageId.UPDATE}
          mode={IncidentMode.EDIT}
          selectedRowData={selectedRowData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default UpdateIncidentCreationTable;
