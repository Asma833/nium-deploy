import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '../api/transactionApi';
import { toast } from 'sonner';

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => deleteTransaction(orderId),
    onSuccess: (data, orderId) => {
      // Invalidate and refetch any related queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      toast.success('Transaction deleted successfully');
    },
    onError: (error, orderId) => {
      console.error('Transaction deletion failed:', error);
      toast.error(
        'Transaction deletion failed. Please try again later.' +
          // Check if error is an AxiosError and has response data
          ((error as any)?.response?.data?.message ? `: ${(error as any).response.data.message}` : '')
      );
    },
  });
};
