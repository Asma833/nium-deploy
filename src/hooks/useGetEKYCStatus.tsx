import { API, HEADER_KEYS } from '@/core/constant/apis';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetEKYCStatus = () => {
  const mutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axiosInstance.get(API.IDFY_STATUS.GET_EKYC_STATUS(orderId), {
        headers: {
          partner_id: HEADER_KEYS.PARTNER_ID,
          api_key: HEADER_KEYS.API_KEY,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('E-Sign status retrieved successfully');
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to retrieve E-Sign status';
      toast.error(errorMessage);
    },
  });

  return {
    data: mutation.data,
    isLoading: mutation.isPending,
    mutate: mutation.mutate,
    refetch: mutation.mutate
  };
};