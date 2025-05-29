import ViewAllTable from '@/components/table/common-tables/view-table/ViewAllTable';
import useGetCheckerOrders from '@/features/checker/hooks/useGetCheckerOrders';
import {
  Order,
  TransactionTypeEnum,
} from '@/features/checker/types/updateIncident.types';

const ViewAllTablePage = () => {
  const {
    data: tableData,
    loading: checkerOrdersLoading,
    error: checkerOrdersError,
    fetchData: refreshData,
  } = useGetCheckerOrders(TransactionTypeEnum.ALL, true);

  return (
    <ViewAllTable
      tableData={tableData ?? ({} as Order)}
      checkerOrdersLoading={checkerOrdersLoading}
      checkerOrdersError={checkerOrdersError ? checkerOrdersError.message : ''}
      refreshData={refreshData}
    />
  );
};

export default ViewAllTablePage;
