import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDocument } from '../api/transactionApi';
import { toast } from 'sonner';

interface UpdateDocumentRequest {
  file?: File;
  partner_order_id: string;
  file_name?: string;
}

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, partner_order_id, file_name }: UpdateDocumentRequest) => {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      }
      formData.append('partner_order_id', partner_order_id);
      if (file_name) {
        formData.append('file_name', file_name);
      }

      return updateDocument(formData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['checker-orders'] });

      toast.success('Document updated successfully');
    },
    onError: (error) => {
      console.error('Document update failed:', error);
      toast.error(
        'Document update failed. Please try again later.' +
          // Check if error has response data with a message
          ((error as any)?.response?.data?.message ? `: ${(error as any).response.data.message}` : '')
      );
    },
  });
};
