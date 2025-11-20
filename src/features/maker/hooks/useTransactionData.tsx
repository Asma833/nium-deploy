import useGetMakerOrders from '@/features/admin/hooks/useGetMakerOrders';
import { TransactionOrderData } from '@/types/common.type';
import { useMemo } from 'react';

// for transaction data management
const useTransactionData = (partnerOrderId: string) => {
  const { data: allTransactionsData = [], loading: isLoading, error, fetchData: refreshData } = useGetMakerOrders();

  const typedAllTransactionsData = useMemo(() => {
    if (!allTransactionsData) return [];

    const normalizedData =
      typeof allTransactionsData === 'object' && !Array.isArray(allTransactionsData)
        ? (Object.values(allTransactionsData) as Record<string, any>[])
        : Array.isArray(allTransactionsData)
          ? (allTransactionsData as Record<string, any>[])
          : [];

    return normalizedData;
  }, [allTransactionsData]);

  const selectedRowTransactionData = typedAllTransactionsData?.find(
    (transaction: TransactionOrderData) => transaction?.partner_order_id === partnerOrderId
  );

  const documentUrls = useMemo(() => {
    if (!selectedRowTransactionData) return {};

    return {
      mergedDocument: selectedRowTransactionData?.merged_document?.url || '',
      vkycVideo:
        selectedRowTransactionData?.vkycs?.length > 0
          ? selectedRowTransactionData.vkycs[0]?.resources_videos_files || ''
          : '',
      vkycDocument:
        selectedRowTransactionData?.vkycs?.length > 0
          ? selectedRowTransactionData.vkycs[0]?.resources_documents_files || ''
          : '',
    };
  }, [selectedRowTransactionData]);

  return {
    selectedRowTransactionData,
    documentUrls,
    isLoading,
    error,
    refreshData,
    checkerComments: selectedRowTransactionData?.incident_checker_comments || '',
    orderStatus: selectedRowTransactionData?.order_status === 'completed',
    viewStatus: selectedRowTransactionData?.order_status === 'rejected',
  };
};

export default useTransactionData;
