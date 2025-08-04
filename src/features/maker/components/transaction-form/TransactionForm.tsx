import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';
import { FormProvider } from '@/components/form/providers/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { transactionFormSchema, transactionFormSubmissionSchema, TransactionFormData } from './transaction-form.schema';
import { getFormControllerMeta } from './transaction-form.config';
import { transactionFormDefaults } from './transaction-form.defaults';
import { TransactionFormProps, TransactionPurposeMap } from './transaction-form.types';
import { Button } from '@/components/ui/button';
import { UploadDocuments } from '@/components/common/UploadDocuments';
import { useCreateTransaction } from '../../hooks/useCreateTransaction';
import { useUpdateOrder } from '../../hooks/useUpdateOrder';
import { transformFormDataToApiRequest, transformFormDataToUpdateRequest } from '../../utils/transformFormData';
import { cn } from '@/utils/cn';
import useGetAllOrders from '@/features/admin/hooks/useGetAllOrders';
import { TransactionOrderData } from '@/types/common.type';
import { useSendEsignLink } from '@/features/checker/hooks/useSendEsignLink';
import TransactionCreatedDialog from '../dialogs/TransactionCreatedDialog';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { useDynamicOptions } from '@/features/checker/hooks/useDynamicOptions';
import { API } from '@/core/constant/apis';
import { useSendVkycLink } from '@/features/checker/hooks/useSendVkycLink';
import { TransactionMode } from '@/types/enums';
import { useCreateTransactionPurposeMap } from '../../hooks/useTransactionPurposeMap';
import { useGetData } from '@/hooks/useGetData';
import { queryKeys } from '@/core/constant/queryKeys';
import useGetDocByTransPurpose from '../../hooks/useGetDocByTransPurpose';

const fieldWrapperBaseStyle = 'mb-5';

const TransactionForm = ({ mode }: TransactionFormProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const partnerOrderIdParam = searchParams.get('partner-order-id') || '';
  const pageTitle = searchParams.get('action') || '';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createdTransactionId, setCreatedTransactionId] = useState<string>('');
  const [niumForexOrderId, setNiumForexOrderId] = useState<string>('');
  const [partnerOrderId, setPartnerOrderId] = useState<string>(partnerOrderIdParam);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [selectedMapDocId, setSelectedMapDocId] = useState<string>('');
  console.log('selectedMapDocId:', selectedMapDocId);
  const [filteredPurposesBySelectedTnxType, setFilteredPurposesBySelectedTnxType] = useState<TransactionPurposeMap[]>(
    []
  );
  console.log('filteredPurposesBySelectedTnxType:', filteredPurposesBySelectedTnxType);
  const [purposeTypeId, setPurposeTypeId] = useState<string>('');
  const [currentTransactionTypeId, setCurrentTransactionTypeId] = useState<string>('');
  console.log('currentTransactionTypeId:', currentTransactionTypeId)
  const [currentPurposeTypeId, setCurrentPurposeTypeId] = useState<string>('');
  const [isOrderGenerated, setIsOrderGenerated] = useState<boolean>(false);
  const lastProcessedCombination = useRef<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef<boolean>(true);
  const { mutate: sendEsignLink, isSendEsignLinkLoading } = useSendEsignLink();
  // const { options: purposeTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_MAPPED_PURPOSES);

  // console.log('transactionPurposeMapData:', transactionPurposeMapData)
  // console.log('purposeTypeOptions:', purposeTypeOptions)
  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_ALL_TRANSACTIONS_TYPES);
  // console.log('transactionTypeOptions:', transactionTypeOptions);
  const { getUserHashedKey } = useCurrentUser();
  const createTransactionMutation = useCreateTransaction();
  const updateOrderMutation = useUpdateOrder();
  const { mutate: sendVkycLink, isSendVkycLinkLoading } = useSendVkycLink();
  const createTransactionPurposeMapMutation = useCreateTransactionPurposeMap();
  // Initially disabled
  const { data: allTransactionsData = [], loading: isLoading, error, fetchData: refreshData } = useGetAllOrders();

  const { data: transactionPurposeMapData } = useGetData<TransactionPurposeMap[]>({
    endpoint: API.TRANSACTION.GET_MAPPED_PURPOSES_BY_ID(currentTransactionTypeId),
    queryKey: queryKeys.transaction.transactionPurposeMap,
    dataPath: 'data',
    enabled: !!currentTransactionTypeId,
  });
  
  console.log('transactionPurposeMapData:', transactionPurposeMapData)
  const {
    docsByTransPurpose,
    isLoading: isDocsLoading,
    refetch: refetchDocs,
    error: isDocsError,
  } = useGetDocByTransPurpose({
    mappedDocPurposeId: selectedMapDocId,
  });

  console.log('docsByTransPurpose:', docsByTransPurpose);

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
  // extract the incident checker comments from the selected transaction data
  const seletedRowTransactionData = typedAllTransactionsData?.find(
    (transaction: TransactionOrderData) => transaction?.partner_order_id === partnerOrderId
  );

  const mergedDocumentUrl = seletedRowTransactionData?.merged_document?.url || '';
  const vkycVideoUrl =
    seletedRowTransactionData?.vkycs?.length && seletedRowTransactionData.vkycs.length > 0
      ? seletedRowTransactionData.vkycs[0]?.resources_videos_files || ''
      : '';
  const vkycDocumentUrl =
    seletedRowTransactionData?.vkycs?.length && seletedRowTransactionData.vkycs.length > 0
      ? seletedRowTransactionData.vkycs[0]?.resources_documents_files || ''
      : '';

  const checkerComments = seletedRowTransactionData?.incident_checker_comments || '';

  const orderStatus = seletedRowTransactionData?.order_status === 'completed';

  // Format transaction types and purpose types for form controller
  const formatedTransactionTypes = transactionTypeOptions.map((type) => ({
    typeId: type.typeId,
    label: type.value,
    value: type.value,
  }));
  const formatedPurposeTypes = transactionPurposeMapData?.map((type) => ({
    mappedDocId: type?.id || '',
    transactionPurposeMapId: type?.transaction_purpose_map_id || '',
    typeId: type.purpose.id,
    purposeHashKey: type.purpose?.hashed_key || '',
    label: type.purpose.purpose_name,
    purposeCode: type.purpose?.purpose_code || '',
    value: type.purpose.purpose_name,
  }));
  // const formatedPurposeTypes = filteredPurpo`sesBySelectedTnxType.map((type) => ({
  //   mappedDocId: type.id || '',
  //   typeId: type.purpose.id,
  //   purposeHashKey: type.purpose?.hashed_key || '',
  //   label: type.purpose.purpose_name,
  //   purposeCode: type.purpose?.purpose_code || '',
  //   value: type.purpose.purpose_name,
  // }));
  
  // Create purpose types compatible with transform function
  const transformCompatiblePurposeTypes = filteredPurposesBySelectedTnxType.map((type) => ({
    ...type,
    typeId: type.purpose.hashed_key,
    label: type.purpose.purpose_name,
    value: type.purpose.purpose_name,
  }));
  
  console.log('formatedPurposeTypes:', formatedPurposeTypes);
  console.log('filteredPurposesBySelectedTnxType:', filteredPurposesBySelectedTnxType);
  console.log('transformCompatiblePurposeTypes:', transformCompatiblePurposeTypes);

  const handlePurposeTypeId = () => {
    // if (purposeTypeOptions.length >= 0) {
    //   const purposeType = purposeTypeOptions.find((type) => type.value === purposeTypeId);
    //   return purposeType ? purposeType.typeId : '';
    // }
    // return '';
    return 'f2a2fc1a-c31a-47f8-b8f1-9b35f3083730';
  };

  // Helper function to get typeId from transaction type value
  // const getTransactionTypeId = (transactionTypeValue: string) => {
  //   const selectedType = formatedTransactionTypes.find((type) => type.value === transactionTypeValue);
  //   return selectedType?.typeId || '';
  // };

  // // Helper function to get typeId from purpose type value
  // const getPurposeTypeId = (purposeTypeValue: string) => {
  //   const selectedType = formatedPurposeTypes.find((type) => type.value === purposeTypeValue);
  //   return selectedType?.typeId || '';
  // };
  // Generate dynamic form config
  const formControllerMeta = getFormControllerMeta({
    transactionTypes: formatedTransactionTypes,
    purposeTypes: formatedPurposeTypes ?? [],
  });
  
  const methods = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transactionFormDefaults,
    mode: 'onChange',
  });
  const {
    control,
    getValues,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  // Determine the mode of the form
  const isUpdatePage = mode === TransactionMode.UPDATE;
  const isViewPage = mode === TransactionMode.VIEW;
  const isEditPage = mode === TransactionMode.EDIT;

  // Watch for changes in transaction type and purpose type
  const { watch } = methods;
  const watchedTransactionType = watch('applicantDetails.transactionType');
  // Get the typeId from watchedTransactionType
  const selectedTransactionType = formatedTransactionTypes.find((type) => type.value === watchedTransactionType);
  console.log('selectedTransactionType:', selectedTransactionType)

  const watchedTransactionTypeId = selectedTransactionType?.typeId || '';
  console.log('watchedTransactionTypeId:', watchedTransactionTypeId)
  const watchedPurposeType = watch('applicantDetails.purposeType');
  const selectedPurposeType = formatedPurposeTypes?.find((type) => type.value === watchedPurposeType);
  console.log('selectedPurposeType:', selectedPurposeType)
  const watchedPurposeTypeDocId = selectedPurposeType?.transactionPurposeMapId || '';
  console.log('watchedPurposeTypeDocId:', watchedPurposeTypeDocId);

  // Watch for changes in paidBy field to control OTHER document behavior
  const watchedPaidBy = watch('applicantDetails.paidBy');

  // Filter and modify documents based on paidBy selection
  const enhancedDocsByTransPurpose = useMemo(() => {
    const baseDocs = docsByTransPurpose || [];
    
    if (watchedPaidBy === 'self') {
      // Filter out OTHER document when "Self" is selected
      return baseDocs.filter(doc => doc.code !== 'OTHER');
    } else if (watchedPaidBy && watchedPaidBy !== 'self') {
      // Make OTHER document mandatory when someone other than "Self" is selected
      return baseDocs.map(doc => {
        if (doc.code === 'OTHER') {
          return {
            ...doc,
            is_mandatory: true
          };
        }
        return doc;
      });
    }
    
    // Default case: return all documents as they are
    return baseDocs;
  }, [docsByTransPurpose, watchedPaidBy]);

  console.log('watchedPurposeType:', watchedPurposeType);
  console.log('watchedTransactionType:', watchedTransactionType);
  console.log('watchedPaidBy:', watchedPaidBy);
  console.log('enhancedDocsByTransPurpose:', enhancedDocsByTransPurpose);

  // const shouldShowSection =
  //   (showUploadSection && partnerOrderId) || (isUpdatePage && !orderStatus) || (isViewPage && !orderStatus);
  // Initialize form values when data is loaded for edit/view mode
  useEffect(() => {
    if ((isEditPage || isViewPage) && seletedRowTransactionData && !isLoading) {
      // Map the transaction data to form structure
      const formValues: Partial<TransactionFormData> = {
        applicantDetails: {
          applicantName: seletedRowTransactionData.customer_name || '',
          applicantPanNumber: seletedRowTransactionData.customer_pan || '',
          email: seletedRowTransactionData.customer_email || '',
          mobileNumber: seletedRowTransactionData.customer_phone || '',
          partnerOrderId: seletedRowTransactionData.partner_order_id || '',
          isVKycRequired: seletedRowTransactionData.is_v_kyc_required || false,
          transactionType: seletedRowTransactionData.transaction_type_name?.name || '',
          purposeType: seletedRowTransactionData.purpose_type_name?.purpose_name || '',
        },
      };

      // Set form values using React Hook Form's setValue
      Object.entries(formValues.applicantDetails || {}).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(`applicantDetails.${key}` as any, value);
        }
      });
    }
  }, [seletedRowTransactionData, isLoading, isEditPage, isViewPage, setValue]);

  useEffect(() => {
    setCurrentTransactionTypeId(watchedTransactionTypeId);
    if (transactionPurposeMapData && watchedTransactionTypeId) {
      setFilteredPurposesBySelectedTnxType(() => [
        ...transactionPurposeMapData.filter((data: any) => {
          console.log('Filtering purpose:', data);
          return data?.purpose?.transactionType?.hashed_key === watchedTransactionTypeId;
        }),
      ]);
    } else {
      setFilteredPurposesBySelectedTnxType([]);
    }
  }, [watchedTransactionTypeId, transactionPurposeMapData]);

  useEffect(() => {
    if (watchedPurposeType && watchedPurposeTypeDocId) {
      setSelectedMapDocId(watchedPurposeTypeDocId);
      if (selectedMapDocId && refetchDocs) {
        refetchDocs();
      }
    }
  }, [watchedPurposeType, watchedPurposeTypeDocId]);
  // console.log('watchedPurposeTypeDocId:', watchedPurposeTypeDocId)

  // Effect to handle transaction type and purpose type changes
  useEffect(() => {
    const selectedMappedDocId = '';
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (watchedTransactionType && watchedPurposeType && !isViewPage && !isEditPage) {
      // Debounce the API call to prevent rapid successive calls
      debounceTimeout.current = setTimeout(() => {}, 500); // 500ms debounce
    }

    // Cleanup function
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [
    watchedTransactionType,
    watchedPurposeType,
    formatedTransactionTypes,
    formatedPurposeTypes,
    isViewPage,
    isEditPage,
  ]);

  // Reset purpose field when transaction type changes
  useEffect(() => {
    // Skip reset on initial load or if in edit/view mode
    if (isInitialLoad.current || isEditPage || isViewPage) {
      isInitialLoad.current = false;
      return;
    }

    // Reset purpose field when transaction type changes
    if (watchedTransactionType) {
      setValue('applicantDetails.purposeType', '');
      // Also reset the selected mapped doc ID when purpose is reset
      setSelectedMapDocId('');
    }
  }, [watchedTransactionType, setValue, isEditPage, isViewPage]);

  // Reset processed combination when form mode changes or component unmounts
  useEffect(() => {
    return () => {
      lastProcessedCombination.current = '';
      isInitialLoad.current = true; // Reset initial load flag
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [isViewPage, isEditPage]);

  const handleRegenerateEsignLink = (pOrderId: string): void => {
    sendEsignLink(
      { partner_order_id: pOrderId || '' },
      {
        onSuccess: () => {
          toast.success('E-sign link generated successfully');
          navigate(`/maker/view-status`);
        },
        onError: () => {
          toast.error('Failed to generate e-sign link');
        },
      }
    );
  };

  // Handle successful document submission and reset form
  const handleDocumentSubmissionSuccess = () => {
    // Reset form to defaults after successful document submission
    reset(transactionFormDefaults);
    setIsOrderGenerated(false);
    setPartnerOrderId('');
    setCreatedTransactionId('');
    setNiumForexOrderId('');
    setShowUploadSection(false);
    setSelectedMapDocId('');
    setFilteredPurposesBySelectedTnxType([]);
    toast.success('Transaction completed successfully!');
    // Navigate to status page
    navigate(`/maker/view-status`);
  };

  // Handle creating a new transaction
  const handleCreateNewTransaction = () => {
    // Reset form to defaults
    reset(transactionFormDefaults);
    setIsOrderGenerated(false);
    setPartnerOrderId('');
    setCreatedTransactionId('');
    setNiumForexOrderId('');
    setShowUploadSection(false);
    setSelectedMapDocId('');
    setFilteredPurposesBySelectedTnxType([]);
    setIsDialogOpen(false);
    toast.success('Ready to create a new transaction');
  };
  const onSubmit = async (formData: TransactionFormData) => {
    setPurposeTypeId('f2a2fc1a-c31a-47f8-b8f1-9b35f3083730');
    try {
      if (isEditPage) {
        // Handle update operation
        const updateRequestData = transformFormDataToUpdateRequest(
          formData,
          transactionTypeOptions,
          transformCompatiblePurposeTypes,
          getUserHashedKey() || 'unknown-user'
        );

        await updateOrderMutation.mutateAsync({
          partnerOrderId: formData?.applicantDetails.partnerOrderId || '',
          data: updateRequestData,
        });

        // Show success message (handled by the mutation's onSuccess)
        // Optionally refresh data or navigate
        refreshData();
      } else {
        // Handle create operation
        const apiRequestData = transformFormDataToApiRequest(formData, transactionTypeOptions, transformCompatiblePurposeTypes);
        const response = await createTransactionMutation.mutateAsync(apiRequestData);
        if (formData?.applicantDetails?.isVKycRequired && response?.status === 201) {
          sendVkycLink(
            { partner_order_id: response.data?.partner_order_id || formData?.applicantDetails?.partnerOrderId },
            {
              onError: () => {
                toast.error('Failed to generated VKYC link');
              },
            }
          );
        }

        // Extract response data based on your API specification
        const partnerOrder = response.data?.partner_order_id || formData?.applicantDetails?.partnerOrderId || '';
        const niumOrder = response.data?.nium_forex_order_id || '';
        setCreatedTransactionId(partnerOrder); // Using partner_order_id as transaction ID
        setNiumForexOrderId(niumOrder);
        setPartnerOrderId(partnerOrder);
        setShowUploadSection(true);
        setIsDialogOpen(true);
        setIsOrderGenerated(true); // Set order generated flag

        // Don't reset form - keep user input values until document submission
        // reset(transactionFormDefaults);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error (show toast, etc.)
    }
  };
  const handleFormSubmit = async () => {
    try {
      // Get current form values
      const currentValues = getValues();

      // Validate using the strict submission schema
      const validationResult = transactionFormSubmissionSchema.safeParse(currentValues);

      if (!validationResult.success) {
        // Extract and display validation errors with user-friendly field names
        const fieldNameMap: Record<string, string> = {
          'applicantDetails.applicantName': 'Applicant Name',
          'applicantDetails.applicantPanNumber': 'Applicant PAN Number',
          'applicantDetails.email': 'Email',
          'applicantDetails.mobileNumber': 'Mobile Number',
          'applicantDetails.partnerOrderId': 'Partner Order ID',
          'applicantDetails.isVKycRequired': 'V-KYC Required',
          'applicantDetails.transactionType': 'Transaction Type',
          'applicantDetails.purposeType': 'Purpose Type',
          'uploadDocuments.pan': 'PAN Document',
        };

        const errorMessages = validationResult.error.errors.map((err) => {
          const fieldPath = err.path.join('.');
          const friendlyFieldName = fieldNameMap[fieldPath] || fieldPath;
          return `${friendlyFieldName}: ${err.message}`;
        });

        // Show the first error in a toast
        toast.error(errorMessages[0] || 'Please fill in all required fields');

        // Log all errors for debugging
        console.error('Validation errors:', errorMessages);

        return; // Don't proceed with submission
      }

      //   // If validation passes, trigger form submission
      handleSubmit(onSubmit)();
    } catch (error) {
      console.error('Form validation error:', error);
      toast.error('Please check the form and try again');
    }
  };

  const handleView = (docUrl: string, docType: 'mergeDoc' | 'vkycDoc' | 'vkycVideo') => {
    if (docUrl && Array.isArray(docUrl)) {
      if (docUrl.length === 1) {
        window.open(docUrl[0], '_blank');
      } else {
        // Create a simple HTML page with links to all documents
        const htmlContent = `
      <html>
        <head><title>Multiple Documents</title></head>
        <body>
          <h2>Documents to Open:</h2>
          ${docUrl
            .map(
              (url, i) => `
            <p><a href="${url}" target="_blank">Document ${i + 1}</a></p>
          `
            )
            .join('')}
        </body>
      </html>
    `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } else {
      if (docUrl && docType === 'mergeDoc') {
        window.open(docUrl, '_blank');
      }
    }
  };
  return (
    <div>
      <div className={cn('flex items-center justify-between pl-2', pageTitle !== 'update' ? 'mb-6' : 'mb-0')}>
        <h1 className="text-xl font-bold capitalize">
          {pageTitle || 'Create'} Transaction
        </h1>
        {isOrderGenerated && (
          <Button
            onClick={handleCreateNewTransaction}
            className="flex items-center gap-2"
          >
            <span>Create New Transaction</span>
          </Button>
        )}
      </div>
      <FormProvider methods={methods}>
        {(!isUpdatePage || isViewPage) && (
          <FormContentWrapper className="w-full bg-transparent">
            <Spacer>
              <FormFieldRow className={cn(fieldWrapperBaseStyle, 'mb-4 px-0')} rowCols={4}>
                {Object.entries(formControllerMeta.fields.applicantDetails).map(([key, field]) => {
                    // Safely access nested error messages for applicantDetails fields
                    let errorMessage: string | undefined = undefined;
                    if (field.name.startsWith('applicantDetails.')) {
                      const subKey = field.name.split('.')[1] as keyof typeof errors.applicantDetails;
                      const applicantDetailError = errors.applicantDetails?.[subKey];
                      errorMessage =
                        applicantDetailError &&
                        typeof applicantDetailError === 'object' &&
                        'message' in applicantDetailError
                          ? (applicantDetailError as { message?: string }).message
                          : undefined;
                    } else {
                      errorMessage = (errors as any)?.[field.name]?.message;
                    }

                    return (
                      <FieldWrapper key={key} className={fieldWrapperBaseStyle}>
                        {getController({
                          ...field,
                          control,
                          errors,
                          disabled:
                            isUpdatePage ||
                            isViewPage ||
                            isOrderGenerated || // Disable fields after order generation
                            (isEditPage && field.name === 'applicantDetails.partnerOrderId') ||
                            ((isEditPage || isUpdatePage) && field.name === 'applicantDetails.isVKycRequired') ||
                            // Disable purpose field when no transaction type is selected
                            (field.name === 'applicantDetails.purposeType' && !watchedTransactionType),
                        })}
                      </FieldWrapper>
                    );
                  })}
              </FormFieldRow>
            </Spacer>
          </FormContentWrapper>
        )}{' '}
        {!isUpdatePage && !isViewPage && !isOrderGenerated && (
          <FormFieldRow className="px-2">
            <Button
              className="min-w-60"
              onClick={handleFormSubmit}
              disabled={isEditPage ? updateOrderMutation.isPending : createTransactionMutation.isPending}
            >
              {isEditPage
                ? updateOrderMutation.isPending
                  ? 'Updating...'
                  : 'Update Order'
                : createTransactionMutation.isPending
                  ? 'Generating...'
                  : 'Generate Order'}
            </Button>
          </FormFieldRow>
        )}
        {isViewPage && checkerComments && (
          <FormFieldRow className="mb-4 w-full">
            <div className="flex flex-col gap-2 w-full bg-[#e6e6e6] p-3 rounded-md">
              <strong className="text-gray-600">Rejection Summary:</strong>{' '}
              <span className="text-red-500">{checkerComments}</span>
            </div>
          </FormFieldRow>
        )}
        <div className="flex gap-2 items-start w-full mb-4">
          {mode === 'view' && mergedDocumentUrl && (
            <div className="flex items-start">
              <Button
                type="button"
                onClick={() => handleView(mergedDocumentUrl, 'mergeDoc')}
                className="disabled:opacity-60"
              >
                View Document
              </Button>
            </div>
          )}
          {mode === 'view' && vkycDocumentUrl.length > 0 && (
            <div className="flex items-start gap-2">
              <Button
                type="button"
                onClick={() => handleView(vkycDocumentUrl, 'vkycDoc')}
                className="disabled:opacity-60"
              >
                VKyc Document
              </Button>
            </div>
          )}
          {mode === 'view' && vkycVideoUrl.length > 0 && (
            <div className="flex items-start gap-2">
              <Button
                type="button"
                onClick={() => handleView(vkycVideoUrl, 'vkycVideo')}
                className="disabled:opacity-60"
              >
                VKyc Video
              </Button>
            </div>
          )}
        </div>
        {/* Show success message after order generation */}
        {isOrderGenerated && (
          <FormFieldRow className="mb-4 w-full">
            <div className="flex flex-col gap-2 w-full bg-green-50 border border-green-200 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <strong className="text-green-800">Order Generated Successfully!</strong>
              </div>
              <span className="text-green-700 text-sm">
                Partner Order ID: <span className="font-semibold">{partnerOrderId}</span>
              </span>
              <span className="text-green-700 text-sm">
                Please upload the required documents below to complete the transaction.
              </span>
            </div>
          </FormFieldRow>
        )}
        
        {/* {shouldShowSection ? (
          <FormFieldRow className="w-full">
            <UploadDocuments
              partnerOrderId={partnerOrderId}
              purposeTypeId={seletedRowTransactionData?.purpose_type_id}
              onESignGenerated={() => {
                handleRegenerateEsignLink(partnerOrderId);
              }}
              isResubmission={isUpdatePage && !orderStatus}
            />
          </FormFieldRow>
        ) : null} */}
        {/* {handlePurposeTypeId() && ( */}
        <FormFieldRow className="w-full">
          {(createTransactionPurposeMapMutation.isPending || isDocsLoading) && (
            <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {createTransactionPurposeMapMutation.isPending
                  ? 'Creating transaction purpose mapping...'
                  : 'Loading document requirements...'}
              </span>
            </div>
          )}
          <UploadDocuments
            partnerOrderId={partnerOrderId}
            purposeTypeId={handlePurposeTypeId()}
            mappedDocuments={enhancedDocsByTransPurpose}
            onESignGenerated={handleDocumentSubmissionSuccess}
            isResubmission={isUpdatePage && !orderStatus}
          />
        </FormFieldRow>
        {/* )} */}
      </FormProvider>
      <TransactionCreatedDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        createdTransactionId={createdTransactionId}
        niumForexOrderId={niumForexOrderId}
      />
    </div>
  );
};

export default TransactionForm;
