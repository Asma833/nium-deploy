import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API, HEADER_KEYS } from '@/core/constant/apis';

export interface UploadDocumentRequest {
  partner_order_id: string;
  document_type_id: string;
  base64_file: string;
  merge_doc: boolean;
}

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  document_id?: string;
  download_url?: string;
}

/**
 * Upload a single document
 */
const uploadDocument = async (data: UploadDocumentRequest): Promise<UploadDocumentResponse> => {
  const response = await axiosInstance.post(API.DOCUMENTS.UPLOAD, data, {
    headers: {
      'Content-Type': 'application/json',
      api_key: HEADER_KEYS.API_KEY,
      partner_id: HEADER_KEYS.PARTNER_ID,
    },
  });
  return response.data;
};

/**
 * Hook for uploading a single document
 */
export const useUploadDocument = () => {
  return useMutation<UploadDocumentResponse, Error, UploadDocumentRequest>({
    mutationFn: uploadDocument,
    onError: (error) => {
      console.error('Document upload failed:', error);
    },
  });
};
