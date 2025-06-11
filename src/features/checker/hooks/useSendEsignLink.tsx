import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIncidentApi } from '../api/updateIncidentApi';
import { EsignLinkRequest } from '../types/updateIncident.types';

export const useSendEsignLink = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation<void, Error, EsignLinkRequest>({
    mutationFn: async (userData: any) => {
      await updateIncidentApi.sendEsignLink(userData);
    },
    onSuccess: () => {
      toast.success('Esign link shared successfully');
      queryClient.invalidateQueries({ queryKey: ['updateIncident'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Esign link sharing failed');
    },
  });

  return { mutate, isSendEsignLinkLoading: isPending, error };
};
