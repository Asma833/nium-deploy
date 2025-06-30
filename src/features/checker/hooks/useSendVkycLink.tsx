import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { updateIncidentApi } from '../api/updateIncidentApi';
import { EsignLinkRequest } from '../types/updateIncident.types';
import { useQueryInvalidator } from '@/hooks/useQueryInvalidator';

export const useSendVkycLink = () => {
  const { invalidateMultipleQueries } = useQueryInvalidator();
  const { mutate, isPending, error } = useMutation<void, Error, EsignLinkRequest>({
    mutationFn: async (userData: any) => {
      await updateIncidentApi.sendVkycLink(userData);
    },
    onSuccess: () => {
      toast.success('Vkyc link generated successfully');
      invalidateMultipleQueries([['updateIncident'], ['orders']]);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Vkyc link sharing failed');
    },
  });

  return { mutate, isSendVkycLinkLoading: isPending, error };
};
