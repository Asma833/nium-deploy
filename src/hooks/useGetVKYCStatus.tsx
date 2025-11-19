import { API, HEADER_KEYS } from '@/core/constant/apis';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetVKYCStatus = (orderId: string, enabled: boolean = true) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ekycStatus', orderId],
    queryFn: async () => {
      const response = await axiosInstance.get(API.IDFY_STATUS.GET_VKYC_STATUS(orderId), {
        headers: {
          partner_id: HEADER_KEYS.PARTNER_ID,
          api_key: HEADER_KEYS.API_KEY,
        },
      });
      return response.data;
    },
    enabled: enabled && !!orderId,
  });

  return {
    data,
    isLoading,
    error
  };
};