import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import useGetDocumentTypes from '@/hooks/useGetDocumentTypes';
import { useUploadDocument } from '@/hooks/useUploadDocuments';
import { convertFileToBase64, formatFileSize, isValidFileType } from '@/utils/fileUtils';
import { toast } from 'sonner';
import FormFieldRow from '../form/wrapper/FormFieldRow';
import FromSectionTitle from './FromSectionTitle';

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
  onUploadComplete?: (success: boolean) => void;
  onESignGenerated?: (success: boolean) => void;
  isResubmission?: boolean;
}

const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
const FILE_SIZE = {
  OTHER_DOC_MAX: 1 * 1024 * 1024,
  ALL_DOC_MAX: 5 * 1024 * 1024,
};
export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  partnerOrderId,
  onUploadComplete,
  onESignGenerated,
  isResubmission = false,
}) => {
  const { documentTypes, loading } = useGetDocumentTypes();
  const uploadDocumentMutation = useUploadDocument();
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<UploadedDocument | null>(null);

  const handleFileUpload = async (file: File, documentTypeId: string, documentTypeName: string) => {
    try {
      // Validate file type
      if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
        toast.error(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        return;
      }

      // Validate file size
      if (file.size > FILE_SIZE.OTHER_DOC_MAX && documentTypeName !== 'All Documents') {
        toast.error(`File size too large. Maximum size: ${formatFileSize(FILE_SIZE.OTHER_DOC_MAX)}`);
        return;
      }
      if (file.size > FILE_SIZE.ALL_DOC_MAX && documentTypeName === 'All Documents') {
        toast.error(`File size too large. Maximum size: ${formatFileSize(FILE_SIZE.ALL_DOC_MAX)}`);
        return;
      }

      // Convert to base64
      const base64 = await convertFileToBase64(file);
      console.log(documentTypeName, 'documentTypeName');
      const newDocument: UploadedDocument = {
        file,
        documentTypeId,
        documentTypeName,
        base64,
        isUploaded: false,
        isUploading: false,
      };

      // Check if document type already exists
      const existingIndex = uploadedDocuments.findIndex((doc) => doc.documentTypeId === documentTypeId);

      if (existingIndex >= 0) {
        // Replace existing document
        const updatedDocuments = [...uploadedDocuments];
        updatedDocuments[existingIndex] = { ...newDocument, isUploaded: false };
        setUploadedDocuments(updatedDocuments);
        toast.success(`${documentTypeName} document updated successfully`);
      } else {
        // Add new document
        setUploadedDocuments([...uploadedDocuments, newDocument]);
        toast.success(`${documentTypeName} document selected successfully`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    }
  };

  const handleRemoveDocument = (documentTypeId: string) => {
    setUploadedDocuments(uploadedDocuments.filter((doc) => doc.documentTypeId !== documentTypeId));
    toast.success('Document removed successfully');
  };

  const handleSubmitDocument = (document: UploadedDocument) => {
    setCurrentDocument(document);
    setShowUploadDialog(true);
  };

  const handleUploadWithMerge = async (mergeDoc: boolean) => {
    if (!currentDocument) return;

    try {
      // Update document state to show loading
      setUploadedDocuments((docs) =>
        docs.map((doc) => (doc.documentTypeId === currentDocument.documentTypeId ? { ...doc, isUploading: true } : doc))
      );

      const uploadData = {
        partner_order_id: partnerOrderId,
        document_type_id: currentDocument.documentTypeId,
        base64_file: currentDocument.base64,
        merge_doc: mergeDoc,
      };

      await uploadDocumentMutation.mutateAsync(uploadData);

      // Update document state to show success
      setUploadedDocuments((docs) =>
        docs.map((doc) =>
          doc.documentTypeId === currentDocument.documentTypeId ? { ...doc, isUploaded: true, isUploading: false } : doc
        )
      );
      setShowUploadDialog(false);
      setCurrentDocument(null);
      toast.success(`${currentDocument.documentTypeName} uploaded successfully`);

      // Call the appropriate callback based on mergeDoc value
      if (mergeDoc) {
        onESignGenerated?.(true);
      } else {
        onUploadComplete?.(true);
      }
    } catch (error) {
      console.error('Error uploading document:', error);

      // Update document state to show error
      setUploadedDocuments((docs) =>
        docs.map((doc) =>
          doc.documentTypeId === currentDocument.documentTypeId ? { ...doc, isUploading: false } : doc
        )
      );

      toast.error(`Failed to upload ${currentDocument.documentTypeName}`);
      setShowUploadDialog(false);
      setCurrentDocument(null);

      // Call the appropriate callback based on mergeDoc value for error handling
      if (mergeDoc) {
        onESignGenerated?.(false);
      } else {
        onUploadComplete?.(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading document types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="w-full flex items-start flex-col">
        <FormFieldRow className="w-full">
          <FromSectionTitle>Upload Document</FromSectionTitle>
        </FormFieldRow>
        <div className="text-md text-gray-600">
          Partner Order ID: <span className="font-bold">{partnerOrderId}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {documentTypes
          .sort((a, b) => {
            if (a.text.includes('All Document')) return -1;
            if (b.text.includes('All Document')) return 1;
            return a.text.localeCompare(b.text);
          })
          .map((docType) => {
            const uploadedDoc = uploadedDocuments.find((doc) => doc.documentTypeId === docType.id);
            const isAllDocumentUploaded = uploadedDocuments.some((doc) => doc.documentTypeName === 'All Documents');
            const isOtherDocumentUploaded = uploadedDocuments.some((doc) => doc.documentTypeName !== 'All Documents');
            const isDisabled =
              (docType.text === 'All Documents' && isOtherDocumentUploaded) ||
              (docType.text !== 'All Documents' && isAllDocumentUploaded);

            return (
              <Card key={docType.id} className="relative flex-1 min-w-[250px] max-w-[250px] p-4 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{docType.text}</CardTitle>
                  {uploadedDoc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => handleRemoveDocument(docType.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  {uploadedDoc ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        {uploadedDoc.isUploaded ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="truncate">{uploadedDoc.file.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">{formatFileSize(uploadedDoc.file.size)}</div>

                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.gif"
                          disabled={isDisabled}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, docType.id, docType.text);
                            }
                          }}
                          className="hidden"
                          id={`file-${docType.id}`}
                        />
                        <label
                          htmlFor={`file-${docType.id}`}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault();
                              toast.warning(
                                docType.text === 'All Documents'
                                  ? 'Cannot upload All Documents when individual documents are selected.'
                                  : 'Cannot upload individual documents when All Documents is selected.'
                              );
                            }
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md ${
                            isDisabled
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                              : 'bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100 border'
                          }`}
                        >
                          <Upload className="h-3 w-3" />
                          Replace
                        </label>
                      </div>

                      {!uploadedDoc.isUploaded && (
                        <Button
                          size="sm"
                          onClick={() => handleSubmitDocument(uploadedDoc)}
                          disabled={uploadedDoc.isUploading}
                          className="w-full"
                        >
                          {uploadedDoc.isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Document'
                          )}
                        </Button>
                      )}

                      {uploadedDoc.isUploaded && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Document uploaded successfully</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.gif"
                        disabled={isDisabled}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, docType.id, docType.text);
                          }
                        }}
                        className="hidden"
                        id={`file-${docType.id}`}
                      />
                      <label
                        htmlFor={`file-${docType.id}`}
                        onClick={(e) => {
                          if (isDisabled) {
                            e.preventDefault();
                            toast.warning(
                              docType.text === 'All Documents'
                                ? 'Cannot upload All Documents when individual documents are selected.'
                                : 'Cannot upload individual documents when All Documents is selected.'
                            );
                          }
                        }}
                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg ${
                          isDisabled
                            ? 'border-gray-300 bg-gray-100 cursor-not-allowed text-gray-400'
                            : 'border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 text-gray-600'
                        }`}
                      >
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">Click to upload</span>
                        <span className="text-xs mt-1">
                          {docType.text === 'All Documents'
                            ? `PDF, JPG, PNG (max ${formatFileSize(FILE_SIZE.ALL_DOC_MAX)})`
                            : `PDF, JPG, PNG (max ${formatFileSize(FILE_SIZE.OTHER_DOC_MAX)})`}
                        </span>
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>Choose how you want to process this document.</DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0"
                onClick={() => setShowUploadDialog(false)}
                aria-label="Close"
              >
                <X size={50} viewBox="0 0 20 20" className="h-16 w-16 text-primary" />
              </Button>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              How would you like to upload "{currentDocument?.documentTypeName}"?
            </p>
            {currentDocument && (
              <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-md">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{currentDocument.documentTypeName}:</span>
                <span className="text-gray-600 truncate">{currentDocument.file.name}</span>
              </div>
            )}
          </div>
          <DialogFooter className="sm:flex-row sm:justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleUploadWithMerge(false)}
              disabled={uploadDocumentMutation.isPending}
            >
              {uploadDocumentMutation.isPending ? 'Uploading...' : 'Continue Upload'}
            </Button>
            <Button onClick={() => handleUploadWithMerge(true)} disabled={uploadDocumentMutation.isPending}>
              {uploadDocumentMutation.isPending ? 'Processing...' : 'Generate E-Sign Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
