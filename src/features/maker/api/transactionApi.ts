import axiosInstance from '@/core/services/axios/axiosInstance';
import { CreateTransactionRequest } from '../types/create-transaction.types';
import { UpdateOrderRequest } from '../types/update-order.types';
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

export const deleteTransaction = (orderId: string) => {
  return axiosInstance.delete(API.ORDERS.DELETE(orderId), {
    headers: {
      accept: '*/*',
    },
  });
};

export const updateOrder = (partnerOrderId: string, data: UpdateOrderRequest) => {
  return axiosInstance.put(API.ORDERS.UPDATE(partnerOrderId), data, {
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
    },
  });
};

export const updateDocument = (formData: FormData) => {
  return axiosInstance.put(API.DOCUMENTS.UPDATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: '*/*',
    },
  });
};
