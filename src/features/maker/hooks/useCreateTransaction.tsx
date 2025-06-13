import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../api/transactionApi';
import { CreateTransactionRequest } from '../types/create-transaction.types';
import { toast } from 'sonner';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => createTransaction(data),
    onSuccess: (data) => {
      // Invalidate and refetch any related queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Transaction creation failed:', error);
      toast.error(
        'Transaction creation failed. Please try again later.' +
          // Check if error is an AxiosError and has response data
          ((error as any)?.response?.data?.message ? `: ${(error as any).response.data.message}` : '')
      );
    },
  });
};
