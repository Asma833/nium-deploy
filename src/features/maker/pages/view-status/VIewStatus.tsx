import React, { useState, useMemo } from 'react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { ViewStatusColumns } from './ViewStatusColumns';
import { DialogWrapper } from '@/components/common/DialogWrapper';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';
import { Order } from '@/features/checker/types/updateIncident.types';
import { useSendEsignLink } from '@/features/checker/hooks/useSendEsignLink';
import { useSendVkycLink } from '@/features/checker/hooks/useSendVkycLink';

const ViewStatus: React.FC = () => {
  // const [loading, setIsLoading] = useState(false);
  // const [hasError, setHasError] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState<string>('');
const { mutate: sendEsignLink, isSendEsignLinkLoading } = useSendEsignLink();
const { mutate: sendVkycLink, isSendVkycLinkLoading } = useSendVkycLink();
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

  const handleRegenerateEsignLink = (rowData: Order): void => {
    if (rowData.nium_order_id) {
      setLoadingOrderId(rowData.nium_order_id);
    }
    sendEsignLink(
      { partner_order_id: rowData.partner_order_id || '' },
      {
        onSuccess: () => {
          setLoadingOrderId('');
        },
        onError: () => {
          setLoadingOrderId('');
        },
      }
    );
  };
  const handleRegenerateVkycLink = (rowData: Order): void => {
    if (rowData.nium_order_id) {
      setLoadingOrderId(rowData.nium_order_id);
    }
    sendVkycLink(
      { partner_order_id: rowData.partner_order_id || '' },
      {
        onSuccess: () => {
          setLoadingOrderId('');
        },
        onError: () => {
          setLoadingOrderId('');
        },
      }
    );
  };
const isPaginationDynamic = false;

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: "",
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });
  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  // Table columns
  const tableColumns = ViewStatusColumns({
    openModal,
    isSendEsignLinkLoading,
    isSendVkycLinkLoading,
    loadingOrderId,
    handleRegenerateEsignLink,
    handleRegenerateVkycLink
  });

 

  return (
    <div className="dynamic-table-wrap">
      <DynamicTable
        columns={tableColumns}
        data={tableData}
        defaultSortColumn="nium_order_id"
        defaultSortDirection="asc"
        loading={isLoading}
        paginationMode={'static'}
         onPageChange={
          isPaginationDynamic ? pagination.handlePageChange : async (_page: number, _pageSize: number) => []
        }
        filter={{
          filterOption: true,
          mode: 'static',
          dateFilterColumn: 'created_at',
          renderFilterOptions: {
            search: true,
            dateRange: true,
            applyAction: true,
            resetAction: true,
          },
        }}
      />
        {isModalOpen && selectedRowData && (
      <DialogWrapper
      title="View Status"
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      renderContent={
        ""
      }
     />
      )}
    </div>
  );
};

export default ViewStatus;