import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIncidentApi } from '../api/updateIncidentApi';
import { EsignLinkRequest } from '../types/updateIncident.types';

export const useSendVkycLink = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation<void, Error, EsignLinkRequest>({
    mutationFn: async (userData: any) => {
      await updateIncidentApi.sendVkycLink(userData);
    },
    onSuccess: () => {
      toast.success('Vkyc link shared successfully');
      queryClient.invalidateQueries({ queryKey: ['updateIncident'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Vkyc link sharing failed');
    },
  });

  return { mutate, isSendVkycLinkLoading: isPending, error };
};
