import { useMemo } from 'react';
import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';
import { Order } from '@/features/checker/types/updateIncident.types';

const ViewAllTablePage = () => {
  const { data, loading: isLoading, error, fetchData: refreshData } = useGetAllOrders();

  const tableData = useMemo(() => {
    if (!data) return [];

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
    if (Array.isArray(data)) {
      result = (data as Order[]).filter(isValidOrder);
    }
    // If object with 'orders' property
    else if (typeof data === 'object' && 'orders' in data) {
      const orders = (data as any).orders;
      if (Array.isArray(orders)) {
        result = orders.filter(isValidOrder);
      } else if (orders && typeof orders === 'object') {
        result = Object.values(orders).filter(isValidOrder);
      }
    }
    // If object of objects
    else if (typeof data === 'object') {
      result = Object.values(data).filter(isValidOrder);
    }
    return result;
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
