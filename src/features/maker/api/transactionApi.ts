import axiosInstance from '@/core/services/axios/axiosInstance';
import { CreateTransactionRequest } from '../types/create-transaction.types';
import { API, HEADER_KEYS } from '@/core/constant/apis';

export const createTransaction = (data: CreateTransactionRequest) => {
  return axiosInstance.post(API.MAKER.GENERATE_ORDER, data, {
    headers: {
      'Content-Type': 'application/json',
      api_key: HEADER_KEYS.API_KEY,
      partner_id: HEADER_KEYS.PARTNER_ID,
    },
  });
};
