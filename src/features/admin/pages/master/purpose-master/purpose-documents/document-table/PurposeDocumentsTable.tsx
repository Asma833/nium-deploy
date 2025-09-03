import { useMemo, useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DialogWrapper } from '@/components/common/DialogWrapper';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useDynamicPagination } from '@/components/common/dynamic-table/hooks/useDynamicPagination';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { getController } from '@/components/form/utils/getController';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { useDeleteDocumentMapping } from '@/features/admin/hooks/useDeleteDocumentMapping';
import { useCreateDocumentTransactionMap } from '@/features/admin/hooks/useCreateDocumentTransactionMap';
import useGetDocByTransPurpose from '@/features/maker/hooks/useGetDocByTransPurpose';
import { API } from '@/core/constant/apis';
import { DocumentsResponse } from '@/features/admin/types/purpose.types';
import { queryKeys } from '@/core/constant/queryKeys';
import { TransactionPurposeMap } from '@/features/maker/components/transaction-form/transaction-form.types';
import { PurposeDocumentColumn } from './PurposeDocumentColumn';
import CreatePurposeDocumentPage from '../create-documents/CreatePurposeDocumentPage';
import { purposeDocumentFormConfig } from '../create-documents/create-purpose-document-form.config';
import { useGetData } from '@/hooks/useGetData';
import { useUpdateDocumentMapping } from '@/features/admin/hooks/useUpdateDocumentMapping';

const PurposeDocumentsTable = () => {
  const { mutate, isPending: isDeleting } = useDeleteDocumentMapping();
  const [dialogTitle, setDialogTitle] = useState('Add Documents');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const {
    data: mappedPurposeTransactionTypesData,
    isLoading: userLoading,
    error: userError,
    refetch: refetchMappingData,
  } = useGetData({
    endpoint: API.PURPOSE.TRANSACTION_MAPPING,
    queryKey: queryKeys.masters.documentMapping,
    dataPath: 'data',
  });

  const methods = useForm();
  const {
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  // Watch for transaction_type changes
  const selectedTransactionType = watch('transaction_type');
  const selectedPurposeType = watch('purpose_type');

  // Get the mapping ID for the selected transaction and purpose types
  // useMemo is used here to:
  // 1) Avoid running an O(n) array search on every render when inputs haven't changed.
  // 2) Keep the selected mapping object reference stable as long as the dependencies are the same,
  //    which helps prevent unnecessary downstream effects/re-renders (e.g., data fetching hooks or effects
  //    that depend on the mapping id).
  // 3) Early return null when either transaction or purpose isn't selected to keep consumers simple and safe.
  const selectedMapping = useMemo(() => {
    if (
      !selectedTransactionType ||
      !selectedPurposeType ||
      !mappedPurposeTransactionTypesData ||
      !Array.isArray(mappedPurposeTransactionTypesData)
    ) {
      return null;
    }
    return (mappedPurposeTransactionTypesData as TransactionPurposeMap[]).find(
      (item) => item.transactionType.id === selectedTransactionType && item.purpose.id === selectedPurposeType
    );
  }, [selectedTransactionType, selectedPurposeType, mappedPurposeTransactionTypesData]);

  // Fetch mapped documents for the selected transaction-purpose combination
  const {
    docsByTransPurpose: mappedDocuments,
    isLoading: mappedDocsLoading,
    refetch: refetchMappedDocs,
  } = useGetDocByTransPurpose({
    mappedDocPurposeId: selectedMapping?.id,
  });

  // Clear purpose_type when transaction_type changes
  const { setValue } = methods;
  const [previousTransactionType, setPreviousTransactionType] = useState<string | null>(null);

  useEffect(() => {
    // Only clear purpose_type if transaction_type actually changed (not on initial load)
    if (selectedTransactionType && selectedTransactionType !== previousTransactionType) {
      setValue('purpose_type', '');
    }
    setPreviousTransactionType(selectedTransactionType);
  }, [selectedTransactionType, setValue, previousTransactionType]);

  const config = purposeDocumentFormConfig({
    mappedPurposeTransactionTypesData: (mappedPurposeTransactionTypesData as TransactionPurposeMap[]) || [],
    selectedTransactionTypeId: selectedTransactionType,
  });
  // Refetch mapped documents when selectedMapping changes
  useEffect(() => {
    if (selectedMapping?.id && refetchMappedDocs) {
      refetchMappedDocs();
    }
  }, [selectedMapping?.id, refetchMappedDocs]);

  const {
    data,
    isLoading,
    error,
    refetch: refreshData,
  } = useGetData<DocumentsResponse>({
    endpoint: API.DOCUMENT_MASTER.GET_DOCUMENTS,
    queryKey: ['getDocumentsList'],
  });

  const [formattedDataArray, setformattedDataArray] = useState<any[]>([]);

  useEffect(() => {
    const documentArray = data?.data;

    if (!documentArray || !Array.isArray(documentArray)) {
      setformattedDataArray([]);
      return;
    }

    // Filter out null items and merge with mapped document data
    const baseDocuments = documentArray.filter((item) => item != null);

    // If we have mapped documents, update the base documents with mapping info
    if (mappedDocuments && mappedDocuments.length > 0) {
      // Create a map to handle duplicate document_ids by taking the most recent or preferred mapping
      const documentMappingMap = new Map();

      mappedDocuments.forEach((mappedDoc) => {
        const existingMapping = documentMappingMap.get(mappedDoc.document_id);

        if (!existingMapping) {
          // First occurrence of this document_id
          documentMappingMap.set(mappedDoc.document_id, mappedDoc);
        } else {
          // Handle duplicate document_id - you can customize this logic
          // For now, we'll merge the requirements (OR operation for boolean values)
          const mergedMapping = {
            ...mappedDoc,
            is_mandatory: existingMapping.is_mandatory || mappedDoc.is_mandatory,
            is_back_required: existingMapping.is_back_required || mappedDoc.is_back_required,
            // Keep the first mapping ID for reference
            id: existingMapping.id,
          };
          documentMappingMap.set(mappedDoc.document_id, mergedMapping);
        }
      });

      const updatedDocuments = baseDocuments.map((doc) => {
        // Find if this document is mapped using the deduplicated map
        const mappedDoc = documentMappingMap.get(doc.id);

        if (mappedDoc) {
          return {
            ...doc,
            isSelected: true,
            requirement: mappedDoc.is_mandatory,
            backRequirement: mappedDoc.is_back_required,
            mappingId: mappedDoc.id, // Store the mapping ID for potential updates
          };
        }

        return {
          ...doc,
          isSelected: false,
          requirement: false,
          backRequirement: false,
          mappingId: null,
        };
      });

      setformattedDataArray(updatedDocuments);
    } else {
      // No mapped documents, reset all to unselected
      const resetDocuments = baseDocuments.map((doc) => ({
        ...doc,
        isSelected: false,
        requirement: false,
        backRequirement: false,
        mappingId: null,
      }));

      setformattedDataArray(resetDocuments);
    }
  }, [data, mappedDocuments]);

  const isPaginationDynamic = false;

  // Use the dynamic pagination hook for fallback
  const pagination = useDynamicPagination({
    endpoint: '',
    initialPageSize: 10,
    dataPath: 'transactions',
    totalRecordsPath: 'totalRecords',
  });

  const handleDeleteConfirm = async (selectedItem: any) => {
    if (!selectedItem?.mappingId) {
      toast.error('Invalid item selected for deletion');
      return;
    }

    mutate(selectedItem.mappingId, {
      onSuccess: () => {
        // Refetch mapped documents and mapping data to reflect changes
        if (refetchMappedDocs) {
          refetchMappedDocs();
        }
        if (typeof refetchMappingData === 'function') {
          refetchMappingData();
        }
        toast.success('Document mapping deleted successfully!');
      },
      onError: (error) => {
        toast.error('Failed to delete document mapping');
        console.error('Delete error:', error);
      },
    });
  };
  const handleEditDocument = (rowData: any) => {
    setDialogTitle('Edit Document');
    setIsModalOpen(true);
    reset(rowData);
    setRowData(rowData);
  };

  const handleSelectionChange = (rowId: string, isSelected: boolean) => {
    const selectedRowIndex = formattedDataArray.findIndex((doc) => doc.id === rowId);

    if (selectedRowIndex !== -1) {
      const UpdatedFormattedArray = [...formattedDataArray];
      const selectedItem = UpdatedFormattedArray[selectedRowIndex];
      // Update selection State
      selectedItem.isSelected = isSelected;

      // Update the state with the modified data
      setformattedDataArray(UpdatedFormattedArray);
      // -----

      if (isSelected) {
        // Ensure form values are set before saving
        if (selectedTransactionType && selectedPurposeType) {
          handleSaveDocuments();
        } else {
          toast.error('Please select both Transaction Type and Purpose Type before saving.');
        }
      } else {
        handleDeleteConfirm(selectedItem);
      }
    } else {
      toast.error('Selected Item not found.');
    }
  };

  const handleMandatoryChange = (rowId: string, isChecked: boolean) => {
    // Update the mandatory value for the specific document
    const updatedData = formattedDataArray.map((doc) => {
      if (doc.id === rowId) {
        return { ...doc, requirement: isChecked, isSelected: isChecked || doc.backRequirement };
      }
      return doc;
    });
    editMapDocument({ data: updatedData.find((doc) => doc.id === rowId) });
    // Update the state with the modified data
    setformattedDataArray(updatedData);
  };
  const handleBackMandatoryChange = (rowId: string, isChecked: boolean) => {
    // Update the back mandatory value for the specific document
    const updatedData = formattedDataArray.map((doc) => {
      if (doc.id === rowId) {
        return { ...doc, backRequirement: isChecked, isSelected: isChecked || doc.requirement };
      }
      return doc;
    });
    editMapDocument({ data: updatedData.find((doc) => doc.id === rowId) });
    // Update the state with the modified data
    setformattedDataArray(updatedData);
  };
  const isTypeSelectionIncomplete = !selectedTransactionType || !selectedPurposeType;

  const tableColumns = PurposeDocumentColumn({
    handleEditDocument,
    handleSelectionChange,
    handleMandatoryChange,
    handleBackMandatoryChange,
    disabled: isTypeSelectionIncomplete,
  });

  // State and handlers for DeleteConfirmationDialog

  const { mutate: mapDocument } = useCreateDocumentTransactionMap({
    onCreateSuccess: () => {
      setIsModalOpen(false);
      // Refetch mapped documents to update the UI with new mappings
      if (refetchMappedDocs) {
        refetchMappedDocs();
      }
      toast.success('Document mapping saved successfully!');
    },
  });

  const { mutate: editMapDocument } = useUpdateDocumentMapping({
    onDocumentUpdateSuccess: () => {
      setIsModalOpen(false);
      // Refetch mapped documents to update the UI with updated mappings
      if (refetchMappedDocs) {
        refetchMappedDocs();
      }
      toast.success('Document mapping updated successfully!');
    },
  });

  const handleSaveDocuments = handleSubmit((formValues) => {
    // Find the selected mapping from the data
    const mappingData = mappedPurposeTransactionTypesData as TransactionPurposeMap[];
    const selectedMappingData = mappingData?.find(
      (item: TransactionPurposeMap) =>
        item.transactionType.id === formValues.transaction_type && item.purpose.id === formValues.purpose_type
    );

    if (!selectedMappingData?.id) {
      toast.error('Please select both Transaction Type and Purpose Type.');
      return;
    }

    const selectedDocuments = formattedDataArray
      .filter((doc) => doc.isSelected)
      .map((doc) => ({
        transaction_purpose_map_id: selectedMappingData.id,
        document_id: doc.id,
        isBackRequired: doc.backRequirement ?? false,
        is_mandatory: doc.requirement ?? false,
      }));

    if (selectedDocuments.length === 0) {
      toast.error('Please select at least one document.');
      return;
    }

    mapDocument([...selectedDocuments]);
  });
  // -----------------

  const leftsideRenderAction = () => {
    // Calculate unique mapped documents count
    const uniqueMappedDocsCount = mappedDocuments ? new Set(mappedDocuments.map((doc) => doc.document_id)).size : 0;

    return (
      <div className="flex items-center space-x-2">
        <p className="pl-3 font-semibold">Required Documents</p>
        {selectedMapping && (
          <span className="text-sm text-muted-foreground bg-blue-100 px-2 py-1 rounded">
            {uniqueMappedDocsCount} mapped
          </span>
        )}
      </div>
    );
  };
  // -----------------

  const rightsideRenderAction = () => (
    <>
      <DialogWrapper
        triggerBtnText="Add Documents"
        triggerBtnClassName="bg-custom-primary text-white hover:bg-custom-primary-hover"
        title={dialogTitle}
        isOpen={isModalOpen}
        className="md:max-w-[60%]"
        setIsOpen={(open) => {
          setIsModalOpen(open);
          if (open && !rowData) {
            // Reset form when opening for add (no rowData)
            reset({});
          }
          if (!open) {
            setDialogTitle('Add Documents');
            setRowData(null);
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
  );
  // -----------------

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
        data={formattedDataArray}
        defaultSortColumn="created_at"
        defaultSortDirection="desc"
        renderLeftSideActions={leftsideRenderAction}
        renderRightSideActions={rightsideRenderAction}
        paginationMode={'static'}
        onPageChange={
          isPaginationDynamic ? pagination.handlePageChange : async (_page: number, _pageSize: number) => []
        }
      />
    </div>
  );
};

export default PurposeDocumentsTable;
