import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API, HEADER_KEYS } from '@/core/constant/apis';

export interface PurposeTypeItem {
  id: string;
  text: string;
}

/**
 * Custom hook to fetch all purpose types
 * @returns Object containing purpose types, loading state, and error state
 */
const fetchPurposeTypes = async (): Promise<PurposeTypeItem[]> => {
  const response = await axiosInstance.get(API.CONFIG.GET_PURPOSE_TYPES, {
    headers: {
      api_key: HEADER_KEYS.API_KEY,
      partner_id: HEADER_KEYS.PARTNER_ID,
    },
  });
  return response.data || [];
};

const useGetPurposes = () => {
  const {
    data: purposeTypes = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery<PurposeTypeItem[], Error>({
    queryKey: ['purposeTypes'],
    queryFn: fetchPurposeTypes,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 1,
  });

  return {
    purposeTypes,
    loading,
    error: isError ? error : null,
  };
};

export default useGetPurposes;
