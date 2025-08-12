import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DialogWrapper } from '@/components/common/DialogWrapper';
import CreatePurposeDocumentPage from '../create-documents/CreatePurposeDocumentPage';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { PurposeDocumentColumn } from './PurposeDocumentColumn';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import { purposeDocumentFormConfig } from '../create-documents/create-purpose-document-form.config';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { getController } from '@/components/form/utils/getController';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { Button } from '@/components/ui/button';
import { useGetData } from '@/hooks/useGetData';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import { useTransactionPurposeMap } from '@/features/checker/hooks/useTransactionPurposeMap';
import { useDeleteDocument } from '@/features/admin/hooks/useDeleteDocument';
import { useCreateDocumentTransactionMap } from '@/features/admin/hooks/useCreateDocumentTransactionMap';
import { API } from '@/core/constant/apis';
import { DocumentsResponse } from '@/features/admin/types/purpose.types';

const PurposeDocumentsTable = () => {
  const { mutate, isPending: isDeleting } = useDeleteDocument();
  const [dialogTitle, setDialogTitle] = useState('Add Documents');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const { options: transactionPurposeTypeOptions } = useTransactionPurposeMap(API.PURPOSE.TRANSACTION_MAPPING);
  const config = purposeDocumentFormConfig(transactionPurposeTypeOptions);

  const {
    data,
    isLoading,
    error,
    refetch: refreshData,
  } = useGetData<DocumentsResponse>({
    endpoint: API.DOCUMENT_MASTER.GET_DOCUMENTS,
    queryKey: ['getDocumentsList'],
  });

  const methods = useForm();
  const {
    control,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  const [formateDataArray, setFormateDataArray] = useState<any[]>([]);

  useMemo(() => {
    const documentArray = data?.data;

    if (!documentArray || !Array.isArray(documentArray)) {
      setFormateDataArray([]);
      return;
    }

    setFormateDataArray(documentArray.filter((item) => item != null));
  }, [data]);

  const isPaginationDynamic = false;

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: '',
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });

  const handleDelete = (rowData: any) => {
    setItemToDelete(rowData);
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    mutate(itemToDelete.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
        if (typeof refreshData === 'function') {
          refreshData();
        }
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
      },
    });
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  const handleEditDocument = (rowData: any) => {
    setDialogTitle('Edit Document');
    setIsModalOpen(true);
    reset(rowData);
    setRowData(rowData);
  };
  const handleSelectionChange = (rowId: string, isSelected: boolean) => {
    // Update the selection status for the specific document
    const updatedData = formateDataArray.map((doc) => {
      if (doc.id === rowId) {
        return { ...doc, isSelected: isSelected };
      }
      return doc;
    });

    // Update the state with the modified data
    setFormateDataArray(updatedData);
  };
  const handleMandatoryChange = (rowId: string, isChecked: boolean) => {
    // Update the mandatory value for the specific document
    const updatedData = formateDataArray.map((doc) => {
      if (doc.id === rowId) {
        return { ...doc, mandatory: isChecked, isSelected: isChecked || doc.backmandatory };
      }
      return doc;
    });

    // Update the state with the modified data
    setFormateDataArray(updatedData);
  };
  const handleBackMandatoryChange = (rowId: string, isChecked: boolean) => {
    // Update the back mandatory value for the specific document
    const updatedData = formateDataArray.map((doc) => {
      if (doc.id === rowId) {
        return { ...doc, backmandatory: isChecked, isSelected: isChecked || doc.mandatory };
      }
      return doc;
    });

    // Update the state with the modified data
    setFormateDataArray(updatedData);
  };
  const tableColumns = PurposeDocumentColumn({
    handleDelete,
    handleEditDocument,
    handleSelectionChange,
    handleMandatoryChange,
    handleBackMandatoryChange,
  });

  // State and handlers for DeleteConfirmationDialog

  const { mutate: mapDocument } = useCreateDocumentTransactionMap({
    onCreateSuccess: () => {
      reset({});
      setIsModalOpen(false);
      if (typeof refreshData === 'function') {
        refreshData();
      }
      const updatedData = formateDataArray.map((doc) => {
        if (doc.id) {
          return { ...doc, mandatory: false, backmandatory: false, isSelected: false };
        }
        return doc;
      });
      setFormateDataArray(updatedData);
    },
  });

  const handleSaveDocuments = handleSubmit((formValues) => {
    // Find the selected object from dropdown options
    const selectedType = transactionPurposeTypeOptions.find((type) => type.value === formValues.transaction_type);

    if (!selectedType?.typeId) {
      toast.error('Please select a Transaction-Purpose Type.');
      return;
    }

    const selectedDocuments = formateDataArray
      .filter((doc) => doc.isSelected)
      .map((doc) => ({
        transaction_purpose_map_id: selectedType.typeId,
        document_id: doc.id,
        isBackRequired: doc.backmandatory ?? false,
        is_mandatory: doc.mandatory ?? false,
      }));

    if (selectedDocuments.length === 0) {
      toast.error('Please select at least one document.');
      return;
    }

    mapDocument([...selectedDocuments]);
  });

  return (
    <div className="dynamic-table-wrap relative">
      <FormProvider {...methods}>
        <FormContentWrapper className="mt-0 p-2 rounded-lg mr-auto bg-transparent w-full">
          <Spacer>
            <FormFieldRow className="mt-0 p-2" rowCols={3}>
              {Object.entries(config.documentField).map(([name, field]) => (
                <FieldWrapper key={name}>
                  {getController({
                    ...(typeof field === 'object' && field !== null ? field : {}),
                    name,
                    control,
                    errors,
                  })}
                </FieldWrapper>
              ))}
            </FormFieldRow>
          </Spacer>
        </FormContentWrapper>
      </FormProvider>

      <DynamicTable
        columns={tableColumns}
        data={formateDataArray}
        defaultSortColumn="created_at"
        defaultSortDirection="desc"
        renderLeftSideActions={() => <p className="pl-3 font-semibold">Required Documents</p>}
        renderRightSideActions={() => (
          <>
            <DialogWrapper
              triggerBtnText="Add Documents"
              triggerBtnClassName="bg-custom-primary text-white hover:bg-custom-primary-hover"
              title={dialogTitle}
              isOpen={isModalOpen}
              className="md:max-w-[60%]"
              setIsOpen={(open) => {
                setIsModalOpen(open);
                if (!open) {
                  setDialogTitle('Add Documents');
                  setRowData(null);
                  reset();
                }
              }}
              isLoading={isSubmitting}
              description=""
              renderContent={
                <>
                  <CreatePurposeDocumentPage
                    setDialogTitle={setDialogTitle}
                    setIsModalOpen={setIsModalOpen}
                    rowData={rowData}
                    refetch={refreshData ?? (() => {})}
                  />
                </>
              }
              footerBtnText=""
            />
          </>
        )}
        paginationMode={'static'}
        onPageChange={
          isPaginationDynamic ? pagination.handlePageChange : async (_page: number, _pageSize: number) => []
        }
      />
      <div className="flex justify-center space-x-2 mt-4">
        <Button
          type="submit"
          className="bg-primary text-white hover:bg-primary mt-4 ml-4 w-fit"
          onClick={handleSaveDocuments}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Document"
        message={
          <>
            Are you sure you want to delete the document <span className="font-semibold">"{itemToDelete?.name}"</span>?
          </>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeleting}
      />
    </div>
  );
};

export default PurposeDocumentsTable;
