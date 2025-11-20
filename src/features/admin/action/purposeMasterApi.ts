import { API } from '@/core/constant/apis';
import { PurposeApiPayload, UpdatePurposeApiPayload } from '../types/purpose.types';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { TransactionMappingPayload } from '../types/transaction.types';

export const purposeMasterApi = {
  purposeMasterCreation: async (purposeData: PurposeApiPayload): Promise<PurposeApiPayload> => {
    const { data } = await axiosInstance.post<PurposeApiPayload>(API.PURPOSE.CREATE_PURPOSE, purposeData);
    return data;
  },
  updatePurpose: async (purposeData: UpdatePurposeApiPayload): Promise<UpdatePurposeApiPayload> => {
    const { id, ...updateData } = purposeData;
    const { data } = await axiosInstance.put<UpdatePurposeApiPayload>(API.PURPOSE.UPDATE_PURPOSE + `${id}`, updateData);
    return data;
  },
  transactionMapping: async (transactionData: TransactionMappingPayload): Promise<TransactionMappingPayload> => {
    const { data } = await axiosInstance.post<TransactionMappingPayload>(
      API.PURPOSE.TRANSACTION_MAPPING,
      transactionData
    );
    return data;
  },
};
