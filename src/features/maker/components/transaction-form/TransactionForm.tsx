import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FormProvider } from '@/components/form/providers/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { transactionFormSchema, transactionFormSubmissionSchema, TransactionFormData } from './transaction-form.schema';
import { getFormControllerMeta } from './transaction-form.config';
import { transactionFormDefaults } from './transaction-form.defaults';
import { TransactionFormProps, TransactionMode } from './transaction-form.types';
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
  const [purposeTypeId, setPurposeTypeId] = useState<string>('');
  const { mutate: sendEsignLink, isSendEsignLinkLoading } = useSendEsignLink();
  const { options: purposeTypeOptions } = useDynamicOptions(API.PURPOSE.GET_PURPOSES);
  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_TRANSACTIONS);
  const { getUserHashedKey } = useCurrentUser();
  const createTransactionMutation = useCreateTransaction();
  const updateOrderMutation = useUpdateOrder();
  const { mutate: sendVkycLink, isSendVkycLinkLoading } = useSendVkycLink();
  const { data: allTransactionsData = [], loading: isLoading, error, fetchData: refreshData } = useGetAllOrders();

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
  const formatedPurposeTypes = purposeTypeOptions.map((type) => ({
    typeId: type.typeId,
    label: type.value,
    value: type.value,
  }));
  const handlePurposeTypeId = () => {
    // if (purposeTypeOptions.length >= 0) {
    //   const purposeType = purposeTypeOptions.find((type) => type.value === purposeTypeId);
    //   return purposeType ? purposeType.typeId : '';
    // }
    // return '';
    return 'f2a2fc1a-c31a-47f8-b8f1-9b35f3083730';
  };
  // Generate dynamic form config
  const formControllerMeta = getFormControllerMeta({
    transactionTypes: formatedTransactionTypes,
    purposeTypes: formatedPurposeTypes,
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

  const shouldShowSection =
    (showUploadSection && partnerOrderId) || (isUpdatePage && !orderStatus) || (isViewPage && !orderStatus);
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
  const onSubmit = async (formData: TransactionFormData) => {
    setPurposeTypeId('f2a2fc1a-c31a-47f8-b8f1-9b35f3083730');
    // try {
    //   if (isEditPage) {
    //     // Handle update operation
    //     const updateRequestData = transformFormDataToUpdateRequest(
    //       formData,
    //       transactionTypeOptions,
    //       purposeTypeOptions,
    //       getUserHashedKey() || 'unknown-user'
    //     );

    //     await updateOrderMutation.mutateAsync({
    //       partnerOrderId: formData?.applicantDetails.partnerOrderId || '',
    //       data: updateRequestData,
    //     });

    //     // Show success message (handled by the mutation's onSuccess)
    //     // Optionally refresh data or navigate
    //     refreshData();
    //   } else {
    //     // Handle create operation
    //     const apiRequestData = transformFormDataToApiRequest(formData, transactionTypeOptions, purposeTypeOptions);
    //     const response = await createTransactionMutation.mutateAsync(apiRequestData);
    //     if (formData?.applicantDetails?.isVKycRequired && response?.status === 201) {
    //       sendVkycLink(
    //         { partner_order_id: response.data?.partner_order_id || formData?.applicantDetails?.partnerOrderId },
    //         {
    //           onError: () => {
    //             toast.error('Failed to generated VKYC link');
    //           },
    //         }
    //       );
    //     }

    //     // Extract response data based on your API specification
    //     const partnerOrder = response.data?.partner_order_id || formData?.applicantDetails?.partnerOrderId || 'PO123';
    //     const niumOrder = response.data?.nium_forex_order_id || 'NIUMF123';
    //     setCreatedTransactionId(partnerOrder); // Using partner_order_id as transaction ID
    //     setNiumForexOrderId(niumOrder);
    //     setPartnerOrderId(partnerOrder);
    //     setShowUploadSection(true);
    //     setIsDialogOpen(true);

    //     // Reset form after successful submission
    //     reset(transactionFormDefaults);
    //   }
    // } catch (error) {
    //   console.error('Form submission error:', error);
    //   // Handle error (show toast, etc.)
    // }
  };
  const handleFormSubmit = async () => {
    // try {
    //   // Get current form values
    //   const currentValues = getValues();

    //   // Validate using the strict submission schema
    //   const validationResult = transactionFormSubmissionSchema.safeParse(currentValues);

    //   if (!validationResult.success) {
    //     // Extract and display validation errors with user-friendly field names
    //     const fieldNameMap: Record<string, string> = {
    //       'applicantDetails.applicantName': 'Applicant Name',
    //       'applicantDetails.applicantPanNumber': 'Applicant PAN Number',
    //       'applicantDetails.email': 'Email',
    //       'applicantDetails.mobileNumber': 'Mobile Number',
    //       'applicantDetails.partnerOrderId': 'Partner Order ID',
    //       'applicantDetails.isVKycRequired': 'V-KYC Required',
    //       'applicantDetails.transactionType': 'Transaction Type',
    //       'applicantDetails.purposeType': 'Purpose Type',
    //       'uploadDocuments.pan': 'PAN Document',
    //     };

    //     const errorMessages = validationResult.error.errors.map((err) => {
    //       const fieldPath = err.path.join('.');
    //       const friendlyFieldName = fieldNameMap[fieldPath] || fieldPath;
    //       return `${friendlyFieldName}: ${err.message}`;
    //     });

    //     // Show the first error in a toast
    //     toast.error(errorMessages[0] || 'Please fill in all required fields');

    //     // Log all errors for debugging
    //     console.error('Validation errors:', errorMessages);

    //     return; // Don't proceed with submission
    //   }

    //   // If validation passes, trigger form submission
     handleSubmit(onSubmit)();
    // } catch (error) {
    //   console.error('Form validation error:', error);
    //   toast.error('Please check the form and try again');
    // }
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
      <h1 className={cn('text-xl font-bold capitalize pl-2', pageTitle !== 'update' ? 'mb-6' : 'mb-0')}>
        {pageTitle || 'Create'} Transaction
      </h1>
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
                          (isEditPage && field.name === 'applicantDetails.partnerOrderId') ||
                          ((isEditPage || isUpdatePage) && field.name === 'applicantDetails.isVKycRequired'),
                      })}
                    </FieldWrapper>
                  );
                })}
              </FormFieldRow>
            </Spacer>
          </FormContentWrapper>
        )}{' '}
        {!isUpdatePage && !isViewPage && (
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
            <UploadDocuments
              partnerOrderId={partnerOrderId}
              purposeTypeId={handlePurposeTypeId()}
              onESignGenerated={() => {
                handleRegenerateEsignLink(partnerOrderId);
              }}
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
