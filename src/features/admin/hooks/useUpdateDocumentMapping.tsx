import { useMutation } from '@tanstack/react-query';
import { documentMasterApi } from '../action/documentMasterApi';
import { toast } from 'sonner';

export const useUpdateDocumentMapping = ({ onDocumentUpdateSuccess }: { onDocumentUpdateSuccess: () => void }) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const payload = {
        transaction_purpose_map_id: data.mappedId,
        document_id: data.documentId,
        isBackRequired: data.backRequirement ?? false,
        is_mandatory: data.requirement ?? false,
      }

      return await documentMasterApi.updateDocumentMapping(data, payload);
    },
    onSuccess: () => {
      const successMessage = 'Document mapping updated successfully';
      toast.success(successMessage);
      onDocumentUpdateSuccess();
    },
    onError: (error: Error) => {
      console.error('Update error:', error);
      const errorMessage = error.message || 'Document mapping failed';
      toast.error(errorMessage);
    },
  });

  return { mutate, isLoading: isPending, error };
};
