import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitFork } from 'lucide-react';
import { useGetData } from '@/hooks/useGetData';
import { API } from '@/core/constant/apis';
import { cn } from '@/utils/cn';
import { PurposeMasterTableColumn } from './purpose-master-table-column';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CreatePurposeMasterPage from './create-purpose-master/CreatePurposeMasterPage';
import TransactionMapping from './transaction/TransactionMappingForm';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { DialogWrapper } from '@/components/common/DialogWrapper';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import DialogCloseButton from '@/components/common/DialogCloseButton';

const PurposeMasterTablePage = () => {
  const { data, isLoading, error, refetch } = useGetData({
    endpoint: API.PURPOSE.GET_PURPOSES,
    queryKey: ['getPurposeList'],
  });
  const [dialogTitle, setDialogTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const navigate = useNavigate();

  const formateDataArray = useMemo(() => {
    if (!data) return [];

    // If API returns the common wrapper { data: [...], message, statusCode }
    if (typeof data === 'object' && data !== null && Array.isArray((data as any).data)) {
      return (data as any).data.filter((item: any) => item != null);
    }

    // If data is already an array, use it directly
    if (Array.isArray(data)) {
      return data.filter((item) => item != null);
    }

    return [];
  }, [data]);

  const isPaginationDynamic = false;

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: '',
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });
  const openTransactionMappingModal = (rowData: any) => {
    setIsMappingModalOpen(true);
    setRowData(rowData);
  };
  const handleEditPurpose = (rowData: any) => {
    setDialogTitle('Edit Purpose');
    setIsModalOpen(true);
    setRowData(rowData);
  };
  const tableColumns = PurposeMasterTableColumn({ openTransactionMappingModal, handleEditPurpose });
  const handleNavigateToDocumentMapping = () => {
    navigate('/admin/master/purpose-master/document-mapping');
  };

  return (
    <div className="dynamic-table-wrap pl-4">
      <DynamicTable
        columns={tableColumns}
        data={formateDataArray}
        defaultSortColumn="created_at"
        defaultSortDirection="desc"
        renderLeftSideActions={() => (
          <>
            <DialogWrapper
              triggerBtnText="Add Purpose"
              triggerBtnClassName="bg-custom-primary text-white hover:bg-custom-primary-hover"
              title={dialogTitle}
              isOpen={isModalOpen}
              setIsOpen={(open) => {
                setIsModalOpen(open);
                if (open) {
                  setRowData(undefined);
                  setDialogTitle('Add Purpose');
                }
              }}
              description=""
              renderContent={
                <>
                  <CreatePurposeMasterPage
                    setDialogTitle={setDialogTitle}
                    rowData={rowData}
                    refetch={refetch ?? (() => {})}
                    setIsModalOpen={setIsModalOpen}
                  />
                </>
              }
              footerBtnText=""
            />

            <Button onClick={handleNavigateToDocumentMapping} className="bg-primary text-white hover:bg-primary ml-4">
              <GitFork className="rotate-180" /> Document Mapping
            </Button>
          </>
        )}
        paginationMode={'static'}
        onPageChange={
          isPaginationDynamic ? pagination.handlePageChange : async (_page: number, _pageSize: number) => []
        }
      />

      <Dialog open={isMappingModalOpen}>
        <DialogContent className={cn('sm:max-w-[400px] md:min-w-[500px] w-full max-h-[90%] overflow-auto')}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{'Transaction Mapping'}</h2>
            <DialogCloseButton onClick={() => setIsMappingModalOpen(false)} />
          </div>
          {rowData && (
            <TransactionMapping
              rowData={rowData}
              setIsMappingModalOpen={setIsMappingModalOpen}
              refetch={refetch ?? (() => {})}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurposeMasterTablePage;
