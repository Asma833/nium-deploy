import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TransactionMappingPayload } from '../types/transaction.types';
import { purposeMasterApi } from '../action/purposeMasterApi';

export const useCreateTransactionMapping = ({
  onTransactionMappingSuccess,
}: {
  onTransactionMappingSuccess: (data: TransactionMappingPayload) => void;
}) => {
  const mapFormDataToApiPayload = (formData: TransactionMappingPayload): TransactionMappingPayload => {
    return {
      transaction_type_id: formData.transaction_type_id,
      purpose_id: formData.purpose_id,
    };
  };
  const { mutate, isPending, error } = useMutation<TransactionMappingPayload, Error, TransactionMappingPayload>({
    mutationFn: async (documentData: TransactionMappingPayload) => {
      const apiPayload = await mapFormDataToApiPayload(documentData);
      await purposeMasterApi.transactionMapping(apiPayload);
      return apiPayload;
    },
    onSuccess: (data: TransactionMappingPayload) => {
      toast.success('Transaction mapping created successfully');
      onTransactionMappingSuccess(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Transaction mapping creation failed');
    },
  });

  return { mutate, isLoading: isPending, error };
};
