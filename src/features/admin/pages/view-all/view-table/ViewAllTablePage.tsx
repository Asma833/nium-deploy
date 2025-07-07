import { useMemo } from 'react';
import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Order } from '@/features/checker/types/updateIncident.types';

const ViewAllTablePage = () => {
  usePageTitle('View All Orders');
  const { data, loading: isLoading, error, fetchData: refreshData } = useGetAllOrders();

  const tableData = useMemo(() => {
    if (!data) return [];

    // If already an array
    if (Array.isArray(data)) {
      return (data as Order[]).filter(
        (item): item is Order => !!item && typeof item === 'object' && 'created_at' in item
      );
    }

    // If object with 'orders' property
    if (typeof data === 'object' && 'orders' in data) {
      const orders = (data as any).orders;
      if (Array.isArray(orders)) {
        return orders.filter((item: any): item is Order => !!item && typeof item === 'object' && 'created_at' in item);
      }
      if (orders && typeof orders === 'object') {
        return Object.values(orders).filter(
          (item: any): item is Order => !!item && typeof item === 'object' && 'created_at' in item
        );
      }
      return [];
    }

    // If object of objects
    if (typeof data === 'object') {
      return Object.values(data).filter(
        (item: any): item is Order => !!item && typeof item === 'object' && 'created_at' in item
      );
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
