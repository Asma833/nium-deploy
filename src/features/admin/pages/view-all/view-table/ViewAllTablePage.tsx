import { useMemo } from 'react';
import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Order } from '@/features/checker/types/updateIncident.types';

const ViewAllTablePage = () => {
  usePageTitle('View All Orders');
  const {
    data,
    loading: isLoading,
    error,
    fetchData: refreshData,
  } = useGetAllOrders();
  // Memoize table data to prevent unnecessary re-renders
  const tableData = useMemo(() => {
    if (!data) return [];

    // Ensure data is an array, handle different possible data structures
    if (Array.isArray(data)) {
      return data as Order[];
    }

    // If data has an orders property
    if (data && typeof data === 'object' && 'orders' in data) {
      return (data as any).orders || [];
    }

    return [];
  }, [data]);

  // Format error message consistently
  const errorMessage = useMemo(() => {
    if (!error) return '';

    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return (error as Error).message;
    }

    return 'An unexpected error occurred';
  }, [error]);

  return (
    <ViewAllTable
      tableData={tableData}
      checkerOrdersLoading={isLoading}
      checkerOrdersError={errorMessage}
      refreshData={refreshData}
      disableColumns={['generate_esign_link', 'partner_id']}
    />
  );
};

export default ViewAllTablePage;
