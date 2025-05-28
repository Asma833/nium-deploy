import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetCheckerOrders from '@/features/checker/hooks/useGetCheckerOrders';
import { TransactionTypeEnum } from '@/features/checker/types/updateIncident.types';

const ViewAllTablePage = () => {
   const {
    data: checkerOrdersData,
    loading: checkerOrdersLoading,
    error: checkerOrdersError,
    fetchData: refreshData,
  } = useGetCheckerOrders(TransactionTypeEnum.ALL, true);
  return <ViewAllTable 
  checkerOrdersData={checkerOrdersData}
  checkerOrdersLoading={checkerOrdersLoading}
  checkerOrdersError={checkerOrdersError ? checkerOrdersError.message : ''}
  refreshData={refreshData}/>;
};

export default ViewAllTablePage;
