import { useEffect } from 'react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import { Button } from '@/components/ui/button';
import { API } from '@/core/constant/apis';
import { getTransactionTableColumns } from './view-all-table-col';
import { exportToCSV } from '@/utils/exportUtils';
import { usePageTitle } from '@/hooks/usePageTitle';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';

const ViewAllTable = () => {
  const { setTitle } = usePageTitle();


  useEffect(() => {
    setTitle('View All');
  }, [setTitle]);

  const {
    data: viewAllData,
    loading: viewAllLoading,
    error: viewAllError,
    fetchData: refreshData,
  } = useGetAllOrders();

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.VIEW_ALL.SEARCH_FILTER,
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });

  const columns = getTransactionTableColumns();

  const handleExportToCSV = () => {
    const dataToExport = viewAllData || [];

    const exportColumns = columns.map((col) => ({
      accessorKey: col.id,
      header: col.name,
    }));

    exportToCSV(dataToExport, exportColumns, 'view-all');
  };

  const isLoading = viewAllLoading || pagination.loading;
  const hasError = viewAllError || pagination.error;
  const totalRecords = viewAllData?.totalOrders || pagination.totalRecords || 0;

  return (
    <div className="flex flex-col">
      <DynamicTable
        columns={columns}
        data={viewAllData || []}
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
        onPageChange={async (_page: number, _pageSize: number) => []}
        totalRecords={totalRecords}
      />
      <div className="flex justify-center sm:justify-start mt-4 gap-3">
        <Button onClick={handleExportToCSV}>Export CSV</Button>
      </div>
    </div>
  );
};

export default ViewAllTable;
