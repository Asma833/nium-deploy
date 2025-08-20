// React imports
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Third-party imports
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';

// Form components
import { FormProvider } from '@/components/form/providers/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';

// UI components
import { Button } from '@/components/ui/button';
import { UploadDocuments } from '@/components/common/UploadDocuments';

// Local components
import TransactionCreatedDialog from '../dialogs/TransactionCreatedDialog';

// Form configuration and types
import { transactionFormSchema, transactionFormSubmissionSchema, TransactionFormData } from './transaction-form.schema';
import { getFormControllerMeta } from './transaction-form.config';
import { transactionFormDefaults } from './transaction-form.defaults';
import { TransactionFormProps, TransactionPurposeMap } from './transaction-form.types';

// Hooks and utilities
import { useCreateTransaction } from '../../hooks/useCreateTransaction';
import { useUpdateOrder } from '../../hooks/useUpdateOrder';
import { useCreateTransactionPurposeMap } from '../../hooks/useTransactionPurposeMap';
import useGetDocByTransPurpose from '../../hooks/useGetDocByTransPurpose';
import { useSendEsignLink } from '@/features/checker/hooks/useSendEsignLink';
import { useSendVkycLink } from '@/features/checker/hooks/useSendVkycLink';
import { useDynamicOptions } from '@/features/checker/hooks/useDynamicOptions';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { useGetData } from '@/hooks/useGetData';

// Constants and types
import { API } from '@/core/constant/apis';
import { queryKeys } from '@/core/constant/queryKeys';
import { TransactionMode } from '@/types/enums';

// Utils
import { transformFormDataToApiRequest, transformFormDataToUpdateRequest } from '../../utils/transformFormData';
import { cn } from '@/utils/cn';
import useTransactionData from '../../hooks/useTransactionData';
import handleViewDocument from '../../utils/handleViewDocument';

// Constants
const FIELD_WRAPPER_BASE_STYLE = 'mb-5';

const TransactionForm = ({ mode }: TransactionFormProps) => {
  // Mode determination
  const isUpdatePage = mode === TransactionMode.UPDATE;
  const isViewPage = mode === TransactionMode.VIEW;
  const isEditPage = mode === TransactionMode.EDIT;

  // Navigation and URL params
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const partnerOrderIdParam = searchParams.get('partner-order-id') || '';
  const pageTitle = searchParams.get('action') || '';

  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrderGenerated, setIsOrderGenerated] = useState<boolean>(false);

  // Transaction state
  const [createdTransactionId, setCreatedTransactionId] = useState<string>('');
  const [niumForexOrderId, setNiumForexOrderId] = useState<string>('');
  const [partnerOrderId, setPartnerOrderId] = useState<string>(partnerOrderIdParam);

  // Document and purpose state
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [selectedMapDocId, setSelectedMapDocId] = useState<string>('');
  const [filteredPurposesBySelectedTnxType, setFilteredPurposesBySelectedTnxType] = useState<TransactionPurposeMap[]>(
    []
  );
  const [currentTransactionTypeId, setCurrentTransactionTypeId] = useState<string>('');

  // Refs for performance optimization
  const lastProcessedCombination = useRef<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef<boolean>(true);
  const isFormInitialized = useRef<boolean>(false);

  // Hooks for external operations
  const { getUserHashedKey } = useCurrentUser();
  const { mutate: sendEsignLink, isSendEsignLinkLoading } = useSendEsignLink();
  const { mutate: sendVkycLink, isSendVkycLinkLoading } = useSendVkycLink();

  // Transaction operations
  const createTransactionMutation = useCreateTransaction();
  const updateOrderMutation = useUpdateOrder();
  const createTransactionPurposeMapMutation = useCreateTransactionPurposeMap();

  // Data fetching hooks
  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_ALL_TRANSACTIONS_TYPES);
  const { selectedRowTransactionData, documentUrls, isLoading, refreshData, checkerComments, orderStatus,viewStatus } =
    useTransactionData(partnerOrderId);
  const { data: transactionPurposeMapData, refetch: refetchTransactionPurposeMap } = useGetData<
  TransactionPurposeMap[]
  >({
    endpoint: API.TRANSACTION.GET_MAPPED_PURPOSES_BY_ID(currentTransactionTypeId),
    queryKey: [...queryKeys.transaction.transactionPurposeMap, currentTransactionTypeId],
    dataPath: 'data',
    enabled: !!currentTransactionTypeId && currentTransactionTypeId.length > 0,
  });
  
  const {
    docsByTransPurpose,
    isLoading: isDocsLoading,
    refetch: refetchDocs,
  } = useGetDocByTransPurpose({
    mappedDocPurposeId: selectedMapDocId,
  });

  // Format transaction types and purpose types for form controller
  const formattedTransactionTypes = transactionTypeOptions?.map((type) => ({
    typeId: type.typeId,
    transactionTypeId: type.id,
    hashKey: type.hashedKey || '',
    label: type.value,
    value: type.value,
  }));

  const formattedPurposeTypes = transactionPurposeMapData?.map((type) => ({
    mappedDocId: type?.id || '',
    transactionPurposeMapId: type?.transaction_purpose_map_id || '',
    typeId: type.purpose.id,
    purposeHashKey: type.purpose?.hashed_key || '',
    label: type.purpose.purpose_name,
    purposeCode: type.purpose?.purpose_code || '',
    value: type.purpose.purpose_name,
  }));

  // Create purpose types compatible with transform function
  const transformCompatiblePurposeTypes = filteredPurposesBySelectedTnxType.map((type) => ({
    ...type,
    typeId: type.purpose.hashed_key,
    label: type.purpose.purpose_name,
    value: type.purpose.purpose_name,
  }));

  // Helper functions
  const handlePurposeTypeId = () => selectedMapDocId || '';

  // Generate dynamic form config
  const formControllerMeta = getFormControllerMeta({
    transactionTypes: formattedTransactionTypes ?? [],
    purposeTypes: formattedPurposeTypes ?? [],
  });

  // Form setup
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
    formState: { errors },
    handleSubmit,
  } = methods;

  // Watch form values
  const { watch } = methods;
  const watchedTransactionType = watch('applicantDetails.transactionType');
  const watchedPurposeType = watch('applicantDetails.purposeType');
  const watchedPaidBy = watch('applicantDetails.paidBy');

  // Get selected transaction type data
  const selectedTransactionType = formattedTransactionTypes?.find((type) => type.value === watchedTransactionType);
  const watchedTransactionTypeId = selectedTransactionType?.typeId || '';
  const watchedTransactionTypeHashKey = selectedTransactionType?.hashKey || '';

  // Get selected purpose type data - only when formattedPurposeTypes is available
  const selectedPurposeType = useMemo(() => {
    if (!formattedPurposeTypes || !watchedPurposeType) return null;
    return formattedPurposeTypes.find((type) => type.value === watchedPurposeType) || null;
  }, [formattedPurposeTypes, watchedPurposeType]);

  const watchedPurposeTypeDocId = selectedPurposeType?.transactionPurposeMapId || '';
  const watchedPurposeHashKey = selectedPurposeType?.purposeHashKey || '';

  // Filter and modify documents based on paidBy selection
  const enhancedDocsByTransPurpose = useMemo(() => {
    const baseDocs = docsByTransPurpose || [];

    if (watchedPaidBy === 'self') {
      return baseDocs.filter((doc) => doc.code !== 'OTHER');
    } else if (watchedPaidBy && watchedPaidBy !== 'self') {
      return baseDocs.map((doc) => (doc.code === 'OTHER' ? { ...doc, is_mandatory: true } : doc));
    }

    return baseDocs;
  }, [docsByTransPurpose, watchedPaidBy]);

  // Initialize transaction type ID early for update/edit/view pages to enable purpose data fetching
  useEffect(() => {
    if (
      (isUpdatePage || isEditPage || isViewPage) && 
      selectedRowTransactionData && 
      formattedTransactionTypes &&
      !currentTransactionTypeId // Only set if not already set
    ) {
      const transactionTypeName = selectedRowTransactionData.transaction_type_name?.name;
      if (transactionTypeName) {
        const matchedType = formattedTransactionTypes.find(type => type.value === transactionTypeName);
        if (matchedType?.typeId) {
          setCurrentTransactionTypeId(matchedType.typeId);
        }
      }
    }
  }, [
    selectedRowTransactionData, 
    formattedTransactionTypes, 
    isUpdatePage, 
    isEditPage, 
    isViewPage,
    currentTransactionTypeId
  ]);

  // Handle transaction type changes from form input - Always update currentTransactionTypeId when transaction type changes
  useEffect(() => {
    if (watchedTransactionTypeId) {
      // Clear any existing timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Debounce the transaction type ID update to prevent rapid API calls
      debounceTimeout.current = setTimeout(() => {
        // Only update if it's actually different to prevent unnecessary refetches
        if (currentTransactionTypeId !== watchedTransactionTypeId) {
          setCurrentTransactionTypeId(watchedTransactionTypeId);
          // Clear filtered purposes immediately when transaction type changes
          setFilteredPurposesBySelectedTnxType([]);
        }
      }, 100); // Small delay to debounce rapid changes
    }
  }, [watchedTransactionTypeId, currentTransactionTypeId]);

  // Filter purposes when transaction purpose data or current transaction type changes
  useEffect(() => {
    if (transactionPurposeMapData && currentTransactionTypeId) {
      const filteredPurposes = transactionPurposeMapData.filter(
        (data: any) => data?.purpose?.transactionType?.hashed_key === currentTransactionTypeId
      );
      setFilteredPurposesBySelectedTnxType(filteredPurposes);
    } else {
      setFilteredPurposesBySelectedTnxType([]);
    }
  }, [transactionPurposeMapData, currentTransactionTypeId]);

  // Manually refetch transaction purpose map when currentTransactionTypeId changes
  useEffect(() => {
    if (currentTransactionTypeId && refetchTransactionPurposeMap) {
      // Small delay to ensure the query key has been updated
      const timeoutId = setTimeout(() => {
        refetchTransactionPurposeMap();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
    return () => {}; // Ensure we always return a cleanup function
  }, [currentTransactionTypeId, refetchTransactionPurposeMap]);

  // Initialize form values when data is loaded for edit/view mode
  useEffect(() => {
    if (
      (isEditPage || isViewPage || isUpdatePage) && 
      selectedRowTransactionData && 
      !isLoading &&
      formattedTransactionTypes &&
      !isFormInitialized.current // Prevent multiple initializations
    ) {
      const formValues: Partial<TransactionFormData> = {
        applicantDetails: {
          applicantName: selectedRowTransactionData.customer_name || '',
          applicantPanNumber: selectedRowTransactionData.customer_pan || '',
          email: selectedRowTransactionData.customer_email || '',
          mobileNumber: selectedRowTransactionData.customer_phone || '',
          partnerOrderId: selectedRowTransactionData.partner_order_id || '',
          isVKycRequired: selectedRowTransactionData.is_v_kyc_required || false,
          transactionType: selectedRowTransactionData.transaction_type_name?.name || '',
          purposeType: selectedRowTransactionData.purpose_type_name?.purpose_name || '',
          paidBy: selectedRowTransactionData.paid_by || '',
        },
      };

      Object.entries(formValues.applicantDetails || {}).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(`applicantDetails.${key}` as any, value);
        }
      });
      
      isFormInitialized.current = true;
    }
  }, [
    selectedRowTransactionData, 
    isLoading, 
    isEditPage, 
    isViewPage, 
    isUpdatePage,
    setValue, 
    formattedTransactionTypes
  ]);

  // Handle purpose type changes and update document mapping
  useEffect(() => {
    if (watchedPurposeType && watchedPurposeTypeDocId) {
      setSelectedMapDocId(watchedPurposeTypeDocId);
    }
  }, [watchedPurposeType, watchedPurposeTypeDocId]);

  // Refetch documents when selectedMapDocId changes
  useEffect(() => {
    if (selectedMapDocId && refetchDocs) {
      refetchDocs();
    }
  }, [selectedMapDocId, refetchDocs]);

  // Reset purpose field when transaction type changes (but not on edit/view/update pages during initial load)
  useEffect(() => {
    if (isInitialLoad.current || isEditPage || isViewPage || isUpdatePage) {
      isInitialLoad.current = false;
      return;
    }

    if (watchedTransactionType) {
      // Reset purpose field and selected document mapping immediately when transaction type changes
      setValue('applicantDetails.purposeType', '');
      setSelectedMapDocId('');
      // Clear filtered purposes to prevent showing stale data
      setFilteredPurposesBySelectedTnxType([]);
    }
  }, [watchedTransactionType, setValue, isEditPage, isViewPage, isUpdatePage]);

  // Cleanup on unmount or mode change
  useEffect(() => {
    return () => {
      lastProcessedCombination.current = '';
      isInitialLoad.current = true;
      isFormInitialized.current = false;
      setCurrentTransactionTypeId(''); // Reset transaction type ID on cleanup
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [isViewPage, isEditPage, isUpdatePage]);

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
    setCurrentTransactionTypeId(''); // Reset transaction type ID
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
    setCurrentTransactionTypeId(''); // Reset transaction type ID
    setIsDialogOpen(false);
    toast.success('Ready to create a new transaction');
  };
  const onSubmit = async (formData: TransactionFormData) => {
    try {
      if (isEditPage) {
        const updateRequestData = transformFormDataToUpdateRequest(
          formData,
          transactionTypeOptions ?? [],
          transformCompatiblePurposeTypes,
          getUserHashedKey() || 'unknown-user'
        );

        await updateOrderMutation.mutateAsync({
          partnerOrderId: formData?.applicantDetails.partnerOrderId || '',
          data: updateRequestData,
        });

        refreshData();
      } else {
        const apiRequestData = transformFormDataToApiRequest(
          formData,
          watchedTransactionTypeHashKey,
          watchedPurposeHashKey
        );
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

        const partnerOrder = response.data?.partner_order_id || formData?.applicantDetails?.partnerOrderId || '';
        const niumOrder = response.data?.nium_forex_order_id || '';
        setCreatedTransactionId(partnerOrder);
        setNiumForexOrderId(niumOrder);
        setPartnerOrderId(partnerOrder);
        setShowUploadSection(true);
        setIsDialogOpen(true);
        setIsOrderGenerated(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
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

  return (
    <div className='w-full'>
      <div className={cn('flex items-center justify-between pl-2', pageTitle !== 'update' ? 'mb-6' : 'mb-0')}>
        <h1 className="text-xl font-bold capitalize">{pageTitle || 'Create'} Transaction</h1>
      </div>
      <FormProvider methods={methods}>
        {
          <FormContentWrapper className="w-full bg-transparent">
            <Spacer>
              <FormFieldRow className={cn(FIELD_WRAPPER_BASE_STYLE, 'mb-4 px-0')} rowCols={4}>
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
                    <FieldWrapper key={key} className={FIELD_WRAPPER_BASE_STYLE}>
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
        }{' '}
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
          {mode === 'view' && documentUrls.mergedDocument && (
            <div className="flex items-start">
              <Button
                type="button"
                onClick={() => handleViewDocument(documentUrls.mergedDocument, 'mergeDoc')}
                className="disabled:opacity-60"
              >
                View Document
              </Button>
            </div>
          )}
          {mode === 'view' && documentUrls.vkycDocument && (
            <div className="flex items-start gap-2">
              <Button
                type="button"
                onClick={() => handleViewDocument(documentUrls.vkycDocument, 'vkycDoc')}
                className="disabled:opacity-60"
              >
                VKyc Document
              </Button>
            </div>
          )}
          {mode === 'view' && documentUrls.vkycVideo && (
            <div className="flex items-start gap-2">
              <Button
                type="button"
                onClick={() => handleViewDocument(documentUrls.vkycVideo, 'vkycVideo')}
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
            disabled={mode === 'view' && !viewStatus}
          />
        </FormFieldRow>
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
