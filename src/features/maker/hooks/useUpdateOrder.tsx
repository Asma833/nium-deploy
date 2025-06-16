import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from '../api/transactionApi';
import { UpdateOrderRequest, PartialUpdateOrderRequest } from '../types/update-order.types';
import { toast } from 'sonner';

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      partnerOrderId,
      data,
    }: {
      partnerOrderId: string;
      data: UpdateOrderRequest | PartialUpdateOrderRequest;
    }) => updateOrder(partnerOrderId, data as UpdateOrderRequest),
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['checker-orders'] });

      toast.success('Order updated successfully');
    },
    onError: (error) => {
      console.error('Order update failed:', error);
      toast.error(
        'Order update failed. Please try again later.' +
          // Check if error has response data with a message
          ((error as any)?.response?.data?.message ? `: ${(error as any).response.data.message}` : '')
      );
    },
  });
};
