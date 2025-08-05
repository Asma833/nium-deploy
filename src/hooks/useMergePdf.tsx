import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API, HEADER_KEYS } from '@/core/constant/apis';

export interface MergePdfRequest {
  partner_order_id: string;
}

export interface MergePdfResponse {
  success: boolean;
  message: string;
  merged_document_url?: string;
  document_id?: string;
}

/**
 * Merge all uploaded documents into a single PDF
 */
const mergePdf = async (data: MergePdfRequest): Promise<MergePdfResponse> => {
  const response = await axiosInstance.post(API.DOCUMENTS.MERGE_PDF, data, {
    headers: {
      'Content-Type': 'application/json',
      api_key: HEADER_KEYS.API_KEY,
      partner_id: HEADER_KEYS.PARTNER_ID,
    },
  });
  return response.data;
};

/**
 * Hook for merging documents into PDF
 */
export const useMergePdf = () => {
  return useMutation<MergePdfResponse, Error, MergePdfRequest>({
    mutationFn: mergePdf,
    onError: (error) => {
      console.error('PDF merge failed:', error);
    },
  });
};
