import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { DocumentMappingPaylod } from '../types/document.type';
import { documentMasterApi } from '../action/documentMasterApi';

export const useCreateDocumentTransactionMap =  (
  { onCreateSuccess }: { onCreateSuccess: (data: DocumentMappingPaylod) => void }
) => {
  const { mutate, isPending, error } = useMutation<DocumentMappingPaylod, Error, DocumentMappingPaylod>({
    mutationFn: async (documentData: DocumentMappingPaylod) => {
      await documentMasterApi.documentTransactionPurposeMapping(documentData)
      return documentData;
    },
    onSuccess: (data: DocumentMappingPaylod) => {
      toast.success('Document Mapped successfully');
      onCreateSuccess(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Document Mapping failed');
    },
  });

  return { mutate, isLoading: isPending, error };
};

