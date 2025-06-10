import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { FormHelperText } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateIncidentFormSchema } from './update-incident-form.schema';
import { FormProvider } from '@/components/form/providers/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { updateFormIncidentConfig } from './update-incident-form.config';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import {
  UpdateIncidentFormData,
  UpdateIncidentRequest,
} from '@/features/checker/types/updateIncident.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import useSubmitIncidentFormData from '../../completed-transactions/hooks/useSubmitIncidentFormData';
import useGetCheckerOrdersByPartnerId from '@/features/checker/hooks/useGetCheckerOrdersByPartnerId';

const UpdateIncidentForm = (props: UpdateIncidentFormData) => {
  const { formActionRight, rowData, setIsModalOpen, mode, pageId } = props;
  const transactionType =
    typeof rowData?.transaction_type_name === 'object'
      ? rowData?.transaction_type_name?.name?.trim()
        ? rowData.transaction_type_name.name
        : 'N/A'
      : rowData?.transaction_type_name
        ? rowData.transaction_type_name
        : 'N/A';
  const purposeType = rowData?.purpose_type_name?.purpose_name
    ? rowData?.purpose_type_name?.purpose_name
    : rowData?.purpose_type_name;

  const { getUserHashedKey } = useCurrentUser();
  const { submitIncidentFormData, isPending } = useSubmitIncidentFormData();

  // usestates
  const [showNiumInvoice, setShowNiumInvoice] = useState(true);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isVkycDownloadLink, setIsVkycDownloadLink] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [isRejected, setIsRejected] = useState(false);
  const [isEsignDocumentLink, setIsEsignDocumentLink] = useState(false);
  const [esignStatus, setEsignStatus] = useState('pending');
  const [partnerOrderId, setPartnerOrderId] = useState('');

  // State to track if we should show the buy/sell field
  // const [showBuySell, setShowBuySell] = useState(true);

  const methods = useForm<UpdateIncidentRequest>({
    resolver: zodResolver(updateIncidentFormSchema),
    defaultValues: {
      fields: {
        niumId: '',
        customerPan: '',
        customerName: '',
        bmfOrderRef: '',
        transactionType: '',
        purpose: '',
        buySell: 'Buy',
        incidentNumber: '',
        eonInvoiceNumber: '',
        comment: '',
        status: { approve: true, reject: false },
        niumInvoiceNumber: '',
      },
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
    setError,
    getValues,
    clearErrors,
  } = methods;

  // Function to reset form to initial state
  const resetFormValues = () => {
    reset({
      fields: {
        niumId: '',
        customerPan: '',
        customerName: '',
        bmfOrderRef: '',
        transactionType: '',
        purpose: '',
        buySell: 'Buy',
        incidentNumber: '',
        eonInvoiceNumber: '',
        comment: '',
        status: { approve: true, reject: false },
        niumInvoiceNumber: '',
      },
    });
    setIsApproved(true);
    setIsRejected(false);
    setDocumentUrl(null);
    setShowNiumInvoice(true);
    // setShowBuySell(true);
  };

  // Reset form when modal is closed
  // This cleanup function runs when the component unmounts

  useEffect(() => {
    return () => {
      resetFormValues();
    };
  }, []);

  useEffect(() => {
    if (pageId === 'completedIncident') {
      setShowNiumInvoice(true);
    }
  }, [pageId]);

  // Update form status when checkbox states change
  useEffect(() => {
    methods.setValue('fields.status', {
      approve: isApproved,
      reject: isRejected,
    });

    // Show or hide the Nium Invoice field based on selection
    setShowNiumInvoice(isApproved && !isRejected);
  }, [isApproved, isRejected, methods]);

  // Populate form with row data when available
  useEffect(() => {
    if (rowData) {
      const buySellValue = rowData?.transaction_mode;
      // const shouldShowBuySell = buySellValue !== null;
      // setShowBuySell(shouldShowBuySell);
      setIsVkycDownloadLink(rowData.is_v_kyc_required ?? false);
      setIsEsignDocumentLink(rowData.is_esign_required ?? false);
      setPartnerOrderId(rowData.partner_order_id || '');
      setEsignStatus(rowData?.e_sign_status || 'pending');

      const mappedData = {
        niumId: rowData.nium_order_id || 'N/A',
        customerPan: rowData.customer_pan || 'N/A',
        customerName: rowData.customer_name || 'N/A',
        bmfOrderRef: rowData.partner_order_id || 'N/A',
        transactionType:
          typeof rowData.transaction_type_name === 'object'
            ? rowData.transaction_type_name?.name?.trim()
              ? rowData.transaction_type_name.name
              : 'N/A'
            : rowData.transaction_type_name
              ? rowData.transaction_type_name
              : 'N/A',
        purpose: rowData.purpose_type_name?.purpose_name || 'N/A',
        buySell: buySellValue || 'N/A',
        // comment: rowData.incident_checker_comments || '',
        incidentNumber: rowData?.incident_number || 'N/A',
        eonInvoiceNumber: rowData?.eon_invoice_number || 'N/A',
        status: {
          approve: rowData.status?.approve ?? true,
          reject: rowData.status?.reject ?? false,
        },
        niumInvoiceNumber: rowData.nium_invoice_number || '',
      };

      // Set values using appropriate field paths
      Object.entries(mappedData).forEach(([key, value]) => {
        if (key === 'comment' || key === 'niumInvoiceNumber') {
          // These fields are directly under 'fields'
          setValue(`fields.${key}`, value as string);
        } else if (key === 'status') {
          // Handle status object separately
          setValue(
            'fields.status',
            value as { approve: boolean; reject: boolean }
          );
        } else {
          setValue(`fields.${key}` as any, value);
        }
      });

      // Set document URL if available
      if (rowData.merged_document && rowData.merged_document.url) {
        setDocumentUrl(rowData.merged_document.url);
      }

      // Set status based on rowData
      setIsApproved(rowData.status?.approve ?? true);
      setIsRejected(rowData.status?.reject ?? false);
    }
  }, [rowData, methods]);

  // Add validation check whenever relevant form values change
  useEffect(() => {
    const comment = methods.getValues('fields.comment');
    const niumInvoiceNumber = methods.getValues('fields.niumInvoiceNumber');

    let valid = true;

    if (isApproved && !niumInvoiceNumber) {
      valid = false;
    }
    if (isRejected && !comment) {
      valid = false;
    } else {
      clearErrors('fields.comment');
    }

    setIsFormValid(valid);
  }, [isApproved, isRejected, methods]);

  // Update watch for form values
  const [comment, niumInvoiceNumber] = methods.watch([
    'fields.comment',
    'fields.niumInvoiceNumber',
  ]);

  // Update validation whenever these values change
  useEffect(() => {
    const valid = !!(
      (isApproved && niumInvoiceNumber) ||
      (isRejected && comment)
    );
    setIsFormValid(valid);
  }, [isApproved, isRejected, comment, niumInvoiceNumber]);

  const handleFormSubmit = async () => {
    if (isRejected && !comment) {
      setError('fields.comment', {
        type: 'required',
        message: 'Comment is required when rejecting an incident',
      });
      return;
    } else {
      clearErrors('fields.comment');
    }

    try {
      await handleSubmit(async (data) => {
        const { fields } = data;

        const formattedData = {
          partner_order_id: fields.bmfOrderRef || '',
          checker_id: getUserHashedKey() || '',
          nium_invoice_number: fields?.status?.approve
            ? fields.niumInvoiceNumber || ''
            : '',
          incident_checker_comments: fields.comment || '',
          incident_status: fields?.status?.approve ? true : false,
        };

        await submitIncidentFormData(formattedData, {
          onSuccess: () => {
            setIsModalOpen(false);
            toast.success('Incident updated successfully');
            resetFormValues();
          },
          onError: (error) => {
            toast.error(error?.message || 'Failed to update incident');
          },
        });
      })();
    } catch (error) {
      toast.error('Form submission failed. Please check your inputs.');
    }
  };

  const {
    data: order,
    loading: loadingOrder,
    error: loadingError,
    fetchData,
  } = useGetCheckerOrdersByPartnerId(partnerOrderId);

  const {
    merged_document,
    esigns,
    resources_documents_files,
    resources_videos_files,
  } = order || {};

  const mergeDocument = merged_document?.url || '';
  const esignFile = esigns?.[0]?.esign_file_details?.esign_file || '';
  const vkycDocumentFiles = resources_documents_files || {};
  const vkycVideoFiles = resources_videos_files?.customer || '';
  const vkycDocumentFilesArray = Object.values(vkycDocumentFiles);

  const handleViewDocument = () => {
    if (mergeDocument) {
      window.open(mergeDocument, '_blank');
    }
  };

  // Download handler for eSign Document
  const handleDownloadDocument = (
    docType: 'esignDocument' | 'vkycDocument' | 'vkycVideo'
  ) => {
    if (docType && docType === 'esignDocument' && esignFile) {
      window.open(esignFile, '_blank');
    } else if (
      docType === 'vkycDocument' &&
      vkycDocumentFilesArray.length > 0
    ) {
      const firstDocument = vkycDocumentFilesArray[0];

      if (firstDocument) {
        window.open(firstDocument, '_blank');
      } else {
        toast.error('No VKYC document available for download');
      }
    } else if (docType === 'vkycVideo' && vkycVideoFiles) {
      const videoUrl = vkycVideoFiles || '';

      if (videoUrl) {
        window.open(videoUrl, '_blank');
      } else {
        toast.error('No VKYC video available for download');
      }
    } else {
      toast.error('No document available for download');
    }
  };

  // Download handler for VKYC Document
  // const handleDownloadVideo = () => {
  //   if (documentUrl) {
  //     window.open(documentUrl, '_blank');
  //   }
  // };

  // Custom handler for the Approve checkbox
  const handleApproveChange = (checked: boolean) => {
    setIsApproved(checked);
    if (checked) {
      // Uncheck reject when approve is checked
      setIsRejected(false);
    }
  };

  // Custom handler for the Reject checkbox
  const handleRejectChange = (checked: boolean) => {
    setIsRejected(checked);
    if (checked) {
      // Uncheck approve when reject is checked
      setIsApproved(false);
    }
  };

  return (
    <FormProvider methods={methods}>
      <FormContentWrapper className="py-2 mt-0 rounded-none">
        <Spacer>
          <FormFieldRow>
            {Object.entries(updateFormIncidentConfig.basicDetails)
              .slice(1, 5)
              .map(([name, field]) => {
                const hasError = !!errors[name as keyof typeof errors];
                return (
                  <FieldWrapper
                    key={name}
                    className={cn('w-full', hasError ? 'mb-8' : 'mb-2')}
                  >
                    {getController({
                      ...field,
                      name,
                      control,
                      errors,
                      disabled: formActionRight === 'view',
                      forcedValue:
                        rowData?.[field.name as keyof typeof rowData],
                    })}
                  </FieldWrapper>
                );
              })}
            {Object.entries(updateFormIncidentConfig.basicDetails)
              .slice(5, 6)
              .map(([name, field]) => {
                const hasError = !!errors[name as keyof typeof errors];
                return (
                  <FieldWrapper
                    key={name}
                    className={cn('w-full', hasError ? 'mb-8' : 'mb-2')}
                  >
                    {getController({
                      ...field,
                      name,
                      control,
                      errors,
                      disabled: formActionRight === 'view',
                      forcedValue: transactionType,
                    })}
                  </FieldWrapper>
                );
              })}
            {Object.entries(updateFormIncidentConfig.basicDetails)
              .slice(6, 7)
              .map(([name, field]) => {
                const hasError = !!errors[name as keyof typeof errors];
                return (
                  <FieldWrapper
                    key={name}
                    className={cn('w-full', hasError ? 'mb-8' : 'mb-2')}
                  >
                    {getController({
                      ...field,
                      name,
                      control,
                      errors,
                      disabled: formActionRight === 'view',
                      forcedValue: purposeType,
                    })}
                  </FieldWrapper>
                );
              })}
          </FormFieldRow>

          {/* <ExchangeRateDetails data={updateFormIncidentConfig.tableData} /> */}

          <FormFieldRow>
            {mode === 'view' &&
              pageId === 'viewAllIncident' &&
              (esignStatus === 'completed' || esignStatus === 'rejected') && (
                <Button
                  type="button"
                  onClick={handleViewDocument}
                  // disabled={!mergeDocument}
                  className="disabled:opacity-60"
                >
                  View Document
                </Button>
              )}
            {isEsignDocumentLink &&
              (pageId === 'updateIncident' ||
                pageId === 'completedIncident') && (
                <Button
                  type="button"
                  onClick={() => handleDownloadDocument('esignDocument')}
                  disabled={!isEsignDocumentLink}
                  className="disabled:opacity-60"
                >
                  eSign Document
                </Button>
              )}

            {Array.isArray(vkycDocumentFilesArray) &&
              vkycDocumentFilesArray.length > 0 &&
              (pageId === 'updateIncident' ||
                pageId === 'completedIncident') && (
                <Button
                  type="button"
                  onClick={() => handleDownloadDocument('vkycDocument')}
                  disabled={
                    !Array.isArray(vkycDocumentFilesArray) ||
                    vkycDocumentFilesArray.length === 0
                  }
                  className="disabled:opacity-60"
                >
                  VKYC Document
                </Button>
              )}
            {vkycVideoFiles &&
              (pageId === 'updateIncident' ||
                pageId === 'completedIncident') && (
                <Button
                  type="button"
                  onClick={() => handleDownloadDocument('vkycVideo')}
                  disabled={!vkycVideoFiles}
                  className="disabled:opacity-60"
                >
                  VKYC Video
                </Button>
              )}
          </FormFieldRow>
          {mode === 'edit' && (
            <FormFieldRow>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approve"
                    checked={isApproved}
                    onCheckedChange={handleApproveChange}
                  />
                  <Label htmlFor="approve" className="cursor-pointer">
                    Approve
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reject"
                    checked={isRejected}
                    onCheckedChange={handleRejectChange}
                  />
                  <Label htmlFor="reject" className="cursor-pointer">
                    Reject
                  </Label>
                </div>
                <FormHelperText error={!!errors.fields?.status}>
                  {errors.fields?.status?.message}
                </FormHelperText>
              </div>
            </FormFieldRow>
          )}

          <FormFieldRow rowCols={2}>
            {mode === 'edit' && (
              <FormFieldRow className="flex-1">
                {getController({
                  ...updateFormIncidentConfig.checkFeedInput.comment,
                  control,
                  errors,
                  name: 'fields.comment',
                  onInputChange: (value: string) => {
                    // Clear validation errors when user starts typing
                    if (value && value.trim().length > 0) {
                      clearErrors('fields.comment');
                    }
                  },
                })}
              </FormFieldRow>
            )}
            {(pageId === 'updateIncident' ||
              pageId === 'completedIncident') && (
              <FormFieldRow className="flex-1">
                {showNiumInvoice &&
                  getController({
                    ...updateFormIncidentConfig.checkFeedInput.niumInvoiceNo,
                    control,
                    errors,
                    name: 'fields.niumInvoiceNumber',
                  })}
              </FormFieldRow>
            )}
          </FormFieldRow>
        </Spacer>
      </FormContentWrapper>
      {(pageId === 'updateIncident' || pageId === 'completedIncident') && (
        <div className="flex justify-center bg-background">
          <Button disabled={isPending} onClick={handleFormSubmit}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Submit'}
          </Button>
        </div>
      )}
    </FormProvider>
  );
};

export default UpdateIncidentForm;
