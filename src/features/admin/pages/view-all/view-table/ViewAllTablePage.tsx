import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';
import { Order } from '@/features/checker/types/updateIncident.types';

const ViewAllTablePage = () => {
  const {
    data: tableData,
    loading: viewAllLoading,
    error: viewAllError,
    fetchData: refreshData,
  } = useGetAllOrders();

  return (
    <ViewAllTable
      tableData={tableData ?? ({} as Order)}
      checkerOrdersLoading={viewAllLoading}
      checkerOrdersError={viewAllError || ''}
      refreshData={refreshData}
    />
  );
};

export default ViewAllTablePage;
