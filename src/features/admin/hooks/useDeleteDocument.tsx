import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { documentMasterApi } from '../action/documentMasterApi';

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => documentMasterApi.deleteDocumentMapping(documentId),
    onSuccess: (data) => {
      // Invalidate and refetch any related queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      console.error('Document deletion failed:', error);
      toast.error(
        'Document deletion failed. Please try again later.' +
          ((error as any)?.response?.data?.message ? `: ${(error as any).response.data.message}` : '')
      );
    },
  });
};
