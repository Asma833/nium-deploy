import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { updateIncidentApi } from '../api/updateIncidentApi';
import { EsignLinkRequest, TransactionType } from '../types/updateIncident.types';
import { useQueryInvalidator } from '@/hooks/useQueryInvalidator';

export const useSendEsignLink = (transactionType?: TransactionType) => {
  const { invalidateMultipleQueries } = useQueryInvalidator();
  const { mutate, isPending, error } = useMutation<void, Error, EsignLinkRequest>({
    mutationFn: async (userData: any) => {
      await updateIncidentApi.sendEsignLink(userData);
    },
    onSuccess: () => {
      toast.success('Esign link generated successfully');
      const queriesToInvalidate = [['updateIncident'], ['orders'], ['checkerOrders']];
      invalidateMultipleQueries(queriesToInvalidate, { exact: false });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Esign link sharing failed');
    },
  });

  return { mutate, isSendEsignLinkLoading: isPending, error };
};
