import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { UnassignCheckerParams } from '../types/checker.types';

const useUnassignChecker = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (params: UnassignCheckerParams) => {
      const response = await axiosInstance.post('/orders/unassign-checker', params);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Checker unassigned successfully');
      queryClient.invalidateQueries({ queryKey: ['updateIncident'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['checkerOrders'] });
    },
    onError: (error) => {
      toast.error('Failed to unassign checker');
    },
  });

  const handleUnassign = (orderId: string, checkerId: string) => {
    mutate({
      orderId,
      checkerId,
    });
  };

  return {
    handleUnassign,
    isPending,
    isError,
    isSuccess,
  };
};

export default useUnassignChecker;
