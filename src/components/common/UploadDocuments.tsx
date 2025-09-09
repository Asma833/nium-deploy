import React, { useState } from 'react';
import { toast } from 'sonner';
import { FileText, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import useGetDocumentTypes from '@/hooks/useGetDocumentTypes';
import { useUploadDocument } from '@/hooks/useUploadDocuments';
import { useMergePdf } from '@/hooks/useMergePdf';
import { Button } from '@/components/ui/button';
import { useSendEsignLink } from '@/features/checker/hooks/useSendEsignLink';
import FormFieldRow from '../form/wrapper/FormFieldRow';
import FromSectionTitle from './FromSectionTitle';
import { convertFileToBase64, formatFileSize, isValidFileType } from '@/utils/fileUtils';
import { cn } from '@/utils/cn';
import { useSendVkycLink } from '@/features/checker/hooks/useSendVkycLink';

interface MappedDocument {
  id: string;
  document_id: string;
  name: string;
  display_name: string | null;
  code: string;
  is_back_required: boolean;
  is_mandatory: boolean;
}

interface UploadedDocument {
  file: File;
  documentTypeId: string;
  documentTypeName: string;
  base64: string;
  isUploaded: boolean;
  isUploading: boolean;
}

interface UploadDocumentsProps {
  partnerOrderId: string;
  isVkycRequired: boolean;
  onUploadComplete?: (success: boolean) => void;
  onESignGenerated?: (success: boolean) => void;
  isResubmission?: boolean;
  purposeTypeId: string;
  mappedDocuments?: MappedDocument[];
  disabled?: boolean;
}

const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
const FILE_SIZE = {
  OTHER_DOC_MAX: 1 * 1024 * 1024,
  ALL_DOC_MAX: 5 * 1024 * 1024,
};

export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  partnerOrderId,
  isVkycRequired,
  onUploadComplete,
  onESignGenerated,
  isResubmission = false,
  purposeTypeId,
  mappedDocuments = [],
  disabled,
}) => {
  const uploadDocumentMutation = useUploadDocument();
  const mergePdfMutation = useMergePdf();
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data fetching hooks
  const { mutate: sendEsignLink, isSendEsignLinkLoading } = useSendEsignLink();
  const { mutate: sendVkycLink, isSendVkycLinkLoading } = useSendVkycLink();
  const { documentTypes, refetch, loading } = useGetDocumentTypes({
    id: purposeTypeId,
    enable: !!purposeTypeId,
  });

  // Disable upload if Partner Order ID is not available
  const isUploadDisabled = !partnerOrderId || partnerOrderId.trim() === '';

  const handleFileUpload = async (file: File, documentTypeId: string, documentTypeName: string) => {
    try {
      // Check if upload is disabled
      if (isUploadDisabled) {
        toast.error('Partner Order ID is required to upload documents');
        return;
      }

      // Validate file type
      if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
        toast.error(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        return;
      }

      // Validate file size
      if (file.size > FILE_SIZE.OTHER_DOC_MAX && documentTypeName?.toLowerCase() !== 'all documents') {
        toast.error(`File size too large. Maximum size: ${formatFileSize(FILE_SIZE.OTHER_DOC_MAX)}`);
        return;
      }
      if (file.size > FILE_SIZE.ALL_DOC_MAX && documentTypeName?.toLowerCase() === 'all documents') {
        toast.error(`File size too large. Maximum size: ${formatFileSize(FILE_SIZE.ALL_DOC_MAX)}`);
        return;
      }

      // Convert to base64
      const base64 = await convertFileToBase64(file);
      const newDocument: UploadedDocument = {
        file,
        documentTypeId,
        documentTypeName,
        base64,
        isUploaded: false,
        isUploading: true, // Start uploading immediately
      };

      // Check if document type already exists
      const existingIndex = uploadedDocuments.findIndex((doc) => doc.documentTypeId === documentTypeId);

      if (existingIndex >= 0) {
        // Replace existing document
        const updatedDocuments = [...uploadedDocuments];
        updatedDocuments[existingIndex] = newDocument;
        setUploadedDocuments(updatedDocuments);
        toast.success(`${documentTypeName} document selected, uploading...`);

        // Upload immediately
        await uploadDocumentImmediately(newDocument, existingIndex);
      } else {
        // Add new document
        const newDocuments = [...uploadedDocuments, newDocument];
        setUploadedDocuments(newDocuments);
        toast.success(`${documentTypeName} document selected, uploading...`);

        // Upload immediately
        await uploadDocumentImmediately(newDocument, newDocuments.length - 1);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    }
  };

  // Function to upload document immediately upon selection
  const uploadDocumentImmediately = async (document: UploadedDocument, docIndex: number) => {
    try {
      const uploadData = {
        partner_order_id: partnerOrderId,
        document_type_id: document.documentTypeId,
        base64_file: document.base64,
        merge_doc: false, // Don't merge during individual uploads
      };

      await uploadDocumentMutation.mutateAsync(uploadData);

      // Update document state to show success
      setUploadedDocuments((docs) =>
        docs.map((doc, index) => (index === docIndex ? { ...doc, isUploaded: true, isUploading: false } : doc))
      );

      toast.success(`${document.documentTypeName} uploaded successfully`);

      // Check if the uploaded document is "All Documents" (AD) and show additional info
      const mappedDoc = mappedDocuments?.find((mapped) => mapped.document_id === document.documentTypeId);
      if (mappedDoc?.code === 'ALL') {
        setTimeout(() => {
          toast.info("All Documents uploaded - other document types are now disabled except 'OTHER'");
        }, 1000);
      } else if (mappedDoc?.code !== 'ALL') {
        // Check if this is the first non-AD document being uploaded
        const otherUploadedDocs = uploadedDocuments.filter((doc) => {
          const otherMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
          return otherMappedDoc?.code !== 'ALL' && doc.isUploaded && doc.documentTypeId !== document.documentTypeId;
        });

        if (otherUploadedDocs.length === 0) {
          setTimeout(() => {
            toast.info("Individual document uploaded - 'All Documents (AD)' option is now disabled");
          }, 1000);
        }
      }

      onUploadComplete?.(true);
    } catch (error) {
      console.error('Error uploading document:', error);

      // Update document state to show error
      setUploadedDocuments((docs) =>
        docs.map((doc, index) => (index === docIndex ? { ...doc, isUploading: false } : doc))
      );

      toast.error(`Failed to upload ${document.documentTypeName}`);
      onUploadComplete?.(false);
    }
  };

  const handleRemoveDocument = (documentTypeId: string) => {
    setUploadedDocuments(uploadedDocuments.filter((doc) => doc.documentTypeId !== documentTypeId));
    toast.success('Document removed successfully');
  };

  // Validate if all required documents are uploaded
  const validateRequiredDocuments = () => {
    // Check if All Documents (AD) is uploaded
    const isAllDocumentUploaded = uploadedDocuments.some((doc) => {
      const uploadedMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
      return uploadedMappedDoc?.code === 'ALL' && doc.isUploaded;
    });

    // If AD is uploaded, validation is considered complete
    if (isAllDocumentUploaded) {
      return {
        isValid: true,
        missing: [],
        total: 1,
        uploaded: 1,
      };
    }

    const documentsToRender =
      mappedDocuments.length > 0
        ? mappedDocuments.map((doc) => ({
            id: doc.document_id,
            name: doc.display_name || doc.name,
            isRequired: doc.is_mandatory,
            isBackRequired: doc.is_back_required,
            code: doc.code,
          }))
        : documentTypes.map((doc) => ({
            id: doc.id,
            name: doc.name,
            isRequired: true, // Assume all documentTypes are required if no mapped docs
            isBackRequired: false,
            code: undefined,
          }));

    // Filter out AD from required documents since we're checking individual docs
    const requiredDocs = documentsToRender.filter((doc) => doc.isRequired && doc.code !== 'ALL');
    const uploadedRequiredDocs = requiredDocs.filter((reqDoc) =>
      uploadedDocuments.some((uploadedDoc) => uploadedDoc.documentTypeId === reqDoc.id && uploadedDoc.isUploaded)
    );

    return {
      isValid: requiredDocs.length === uploadedRequiredDocs.length,
      missing: requiredDocs
        .filter(
          (reqDoc) =>
            !uploadedDocuments.some((uploadedDoc) => uploadedDoc.documentTypeId === reqDoc.id && uploadedDoc.isUploaded)
        )
        .map((doc) => doc.name),
      total: requiredDocs.length,
      uploaded: uploadedRequiredDocs.length,
    };
  };

  // Handle submit with validation and merge PDF
  const handleSubmit = async () => {
    try {
      if (isUploadDisabled) {
        toast.error('Partner Order ID is required');
        return;
      }

      const validation = validateRequiredDocuments();

      if (!validation.isValid) {
        toast.error(`Please upload all required documents. Missing: ${validation.missing.join(', ')}`);
        return;
      }

      if (uploadedDocuments.length === 0) {
        toast.error('Please upload at least one document before submitting');
        return;
      }

      // Check if any documents are still uploading
      const stillUploading = uploadedDocuments.some((doc) => doc.isUploading);
      if (stillUploading) {
        toast.error('Please wait for all documents to finish uploading');
        return;
      }

      setIsSubmitting(true);

      // Call merge PDF API
      const mergeResponse = await mergePdfMutation.mutateAsync({
        partner_order_id: partnerOrderId,
      });

      sendEsignLink(
        { partner_order_id: partnerOrderId || '' },
        {
          onSuccess: () => {
            setIsSubmitting(false);
            toast.success('E-sign link generated successfully');
            onESignGenerated?.(true);
          },
          onError: () => {
            toast.error('Failed to generate e-sign link');
          },
        }
      );

      if (isVkycRequired) {
        sendVkycLink(
          { partner_order_id: partnerOrderId || '' },
          {
            onSuccess: () => {
              toast.success('Video KYC link generated successfully');
            },
            onError: () => {
              toast.error('Failed to generate Video KYC link');
            },
          }
        );
      }

      toast.success('Documents merged successfully');
      onESignGenerated?.(true);
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Failed to process documents');
      onESignGenerated?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          <p className="mt-3 text-sm font-medium text-gray-700">Loading document types...</p>
        </div>
      </div>
    );
  }

  // Show waiting message if we're waiting for mapped documents and don't have documentTypes either
  if (mappedDocuments.length === 0 && documentTypes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 w-full border border-gray-400 rounded-md bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">Document Upload</p>
          <p className="text-xs text-gray-500 max-w-md">
            Please select a transaction type and purpose type above to see the required documents for upload.
          </p>
        </div>
      </div>
    );
  }

  // Use mapped documents if available, otherwise fall back to documentTypes
  const documentsToRender =
    mappedDocuments.length > 0
      ? mappedDocuments
          .map((doc, index) => ({
            id: doc.document_id,
            uniqueKey: `${doc.id}-${index}`, // Use the unique id from MappedDocument plus index for uniqueness
            name: doc.display_name || doc.name,
            isRequired: doc.is_mandatory,
            isBackRequired: doc.is_back_required,
            code: doc.code, // Include code for sorting
          }))
          .sort((a, b) => {
            // Sort: AD first, OTHER last, everything else in between
            if (a.code === 'ALL' && b.code !== 'ALL') return -1;
            if (a.code !== 'ALL' && b.code === 'ALL') return 1;
            if (a.code === 'OTHER' && b.code !== 'OTHER') return 1;
            if (a.code !== 'OTHER' && b.code === 'OTHER') return -1;
            return 0; // Keep original order for others
          })
      : documentTypes.map((doc, index) => ({
          id: doc.id,
          uniqueKey: `${doc.id}-${index}`, // Add uniqueKey for consistency
          name: doc.name,
          isRequired: true,
          isBackRequired: false,
          code: undefined, // No code available for fallback documentTypes
        }));

  const validation = validateRequiredDocuments();

  return (
    <div className="space-y-6 w-full">
      <div className="w-full flex items-start flex-col">
        <FormFieldRow className="w-full">
          <FromSectionTitle className="font-bold text-xl">Upload Document</FromSectionTitle>
        </FormFieldRow>
        {/* <div className="text-md text-gray-600 mb-2">
          Partner Order ID: <span className="font-bold">{partnerOrderId || 'Not Available'}</span>
        </div> */}

        {/* Upload Status */}
        {isUploadDisabled && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-md w-full">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">
              Partner Order ID is required to upload documents. Please generate an order to proceed.
            </span>
          </div>
        )}

        {!isUploadDisabled && validation.total > 0 && (
          <div
            className={`flex items-center gap-2 mb-4 p-3 rounded-md w-full ${
              validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {validation.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
            <span className={`text-sm ${validation.isValid ? 'text-green-700' : 'text-yellow-700'}`}>
              {(() => {
                const isAllDocumentUploaded = uploadedDocuments.some((doc) => {
                  const uploadedMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
                  return uploadedMappedDoc?.code === 'ALL' && doc.isUploaded;
                });

                if (validation.isValid && isAllDocumentUploaded) {
                  return 'All Documents (AD) uploaded - validation complete';
                } else if (validation.isValid) {
                  return `All required documents uploaded (${validation.uploaded}/${validation.total})`;
                } else {
                  return `Required documents: ${validation.uploaded}/${validation.total} uploaded`;
                }
              })()}
            </span>
          </div>
        )}

        {/* Show info when AD is uploaded and other docs are disabled */}
        {!isUploadDisabled &&
          uploadedDocuments.some((doc) => {
            const uploadedMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
            return uploadedMappedDoc?.code === 'ALL' && doc.isUploaded;
          }) && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md w-full">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                All Documents (AD) uploaded successfully. Only "OTHER" document type remains available for upload.
              </span>
            </div>
          )}

        {/* Show info when other docs are uploaded and AD is disabled */}
        {!isUploadDisabled &&
          uploadedDocuments.some((doc) => {
            const uploadedMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
            return uploadedMappedDoc?.code !== 'ALL' && doc.isUploaded;
          }) &&
          !uploadedDocuments.some((doc) => {
            const uploadedMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
            return uploadedMappedDoc?.code === 'ALL' && doc.isUploaded;
          }) && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md w-full">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700">
                Individual documents uploaded. "All Documents (AD)" option is now disabled.
              </span>
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentsToRender.map((docType) => {
          const uploadedDoc = uploadedDocuments.find((doc) => doc.documentTypeId === docType.id);

          // Use the code from the sorted documentsToRender array
          const docCode = docType.code;

          // Check if All Documents (code 'ALL') is uploaded successfully
          const isAllDocumentUploaded = uploadedDocuments.some((doc) => {
            const uploadedMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
            return uploadedMappedDoc?.code === 'ALL' && doc.isUploaded;
          });
          // Check if any other document (not AD) is uploaded
          const isAnyOtherDocumentUploaded = uploadedDocuments.some((doc) => {
            const uploadedMappedDoc = mappedDocuments.find((mapped) => mapped.document_id === doc.documentTypeId);
            return uploadedMappedDoc?.code !== 'ALL' && doc.isUploaded;
          });

          // Disable logic:
          // 1. If AD is uploaded, disable all documents except OTHER
          // 2. If any other document is uploaded, disable AD
          // 3. Also consider the general upload disabled state
          const isDisabled =
            isUploadDisabled ||
            (isAllDocumentUploaded && docCode !== 'OTHER') ||
            (isAnyOtherDocumentUploaded && docCode === 'ALL');

          return (
            <div
              key={docType.uniqueKey}
              className={cn('space-y-2', disabled && 'pointer-events-none opacity-50 cursor-not-allowed')}
            >
              <label className="block text-sm font-medium text-gray-700">
                {docType.name}
                {docType.isRequired && !isAllDocumentUploaded && <span className="text-red-500 ml-1">*</span>}
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  disabled={isDisabled}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, docType.id, docType.name);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDisabled
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed text-gray-400'
                      : 'bg-background border-gray-300 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                  title={
                    isAllDocumentUploaded && docCode !== 'OTHER' && docCode !== 'ALL'
                      ? 'This document type is disabled because All Documents (AD) has been uploaded'
                      : isAnyOtherDocumentUploaded && docCode === 'ALL'
                        ? 'All Documents (AD) is disabled because individual documents have been uploaded'
                        : undefined
                  }
                  id={`file-${docType.id}`}
                />

                {/* Upload Status Overlay */}
                {uploadedDoc && (
                  <div className="mt-2 flex items-center gap-2">
                    {uploadedDoc.isUploading ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    ) : uploadedDoc.isUploaded ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Uploaded: {uploadedDoc.file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-auto"
                          onClick={() => {
                            handleRemoveDocument(docType.id);
                            // Clear the file input when removing the document
                            const input = document.getElementById(`file-${docType.id}`) as HTMLInputElement | null;
                            if (input) input.value = '';
                          }}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{uploadedDoc.file.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {docType.name === 'All Documents'
                  ? `PDF, JPG, PNG (max ${formatFileSize(FILE_SIZE.ALL_DOC_MAX)})`
                  : `PDF, JPG, PNG (max ${formatFileSize(FILE_SIZE.OTHER_DOC_MAX)})`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isUploadDisabled || isSubmitting || mergePdfMutation.isPending}
          className="min-w-64"
        >
          {isSubmitting || mergePdfMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit Documents'
          )}
        </Button>
      </div>
    </div>
  );
};
