import { useMemo } from 'react';
import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetCheckerOrders from '@/features/checker/hooks/useGetCheckerOrders';
import { usePageTitle } from '@/hooks/usePageTitle';
import {
  Order,
  TransactionTypeEnum,
} from '@/features/checker/types/updateIncident.types';

const ViewAllTablePage = () => {
  usePageTitle('View All Orders');

  const {
    data,
    loading: isLoading,
    error,
    fetchData: refreshData,
  } = useGetCheckerOrders(TransactionTypeEnum.ALL, true);

  // Memoize table data to prevent unnecessary re-renders
  const tableData = useMemo(() => {
    if (!data) return [];

    // Handle the checker orders data structure
    if (data.orders && Array.isArray(data.orders)) {
      return data.orders as Order[];
    }

    // Fallback for direct array
    if (Array.isArray(data)) {
      return data as Order[];
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
    />
  );
};

export default ViewAllTablePage;
