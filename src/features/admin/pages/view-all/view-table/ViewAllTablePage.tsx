import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';

const ViewAllTablePage = () => {
   const {
    data: viewAllData,
    loading: viewAllLoading,
    error: viewAllError,
    fetchData: refreshData,
  } = useGetAllOrders();
  
  return <ViewAllTable 
   checkerOrdersData={viewAllData}
  checkerOrdersLoading={viewAllLoading}
  checkerOrdersError={viewAllError || ''}
  refreshData={refreshData}
  />;
};

export default ViewAllTablePage;
