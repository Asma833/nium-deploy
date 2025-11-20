import axiosInstance from '@/core/services/axios/axiosInstance';
import { API, HEADER_KEYS } from '@/core/constant/apis';

export interface CreateTransactionPurposeMapRequest {
  transaction_type_id: string;
  purpose_id: string;
}

export interface CreateTransactionPurposeMapResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    transaction_type_id: string;
    purpose_id: string;
    created_by: string;
    updated_at: string;
    created_at: string;
    updated_by: string | null;
  };
}

export interface MappedDocument {
  id: string;
  document_id: string;
  name: string;
  display_name: string | null;
  code: string;
  is_back_required: boolean;
  is_mandatory: boolean;
}

export interface GetMappedDocumentsResponse {
  statusCode: number;
  message: string;
  data: MappedDocument[];
}

export const createTransactionPurposeMap = (data: CreateTransactionPurposeMapRequest) => {
  return axiosInstance.post<CreateTransactionPurposeMapResponse>(API.TRANSACTION_PURPOSE_MAP.CREATE, data, {
    headers: {
      'Content-Type': 'application/json',
      api_key: HEADER_KEYS.API_KEY,
      partner_id: HEADER_KEYS.PARTNER_ID,
    },
  });
};

export const getMappedDocuments = (transactionTypeId: string) => {
  return axiosInstance.get<GetMappedDocumentsResponse>(API.TRANSACTION_PURPOSE_MAP.GET_DOCUMENTS(transactionTypeId), {
    headers: {
      'Content-Type': 'application/json',
      api_key: HEADER_KEYS.API_KEY,
      partner_id: HEADER_KEYS.PARTNER_ID,
    },
  });
};
