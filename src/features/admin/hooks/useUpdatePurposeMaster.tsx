import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { purposeMasterApi } from '../action/purposeMasterApi';

export const useUpdatePurposeMaster = ({ onPurposeUpdateSuccess }: { onPurposeUpdateSuccess: () => void }) => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, id }: any) => {
      const payload = {
        purpose_name: data.purpose_name,
        purpose_code: data.purpose_code,
        id: id,
      };

      return await purposeMasterApi.updatePurpose(payload);
    },
    onSuccess: () => {
      const successMessage = 'Purpose updated successfully';
      toast.success(successMessage);
      const url = '/admin/master/purpose-master';
      navigate(url);
      onPurposeUpdateSuccess();
    },
    onError: (error: Error) => {
      const errorMessage = (error.message = 'Purpose update failed');
      toast.error(errorMessage);
    },
  });

  return { mutate, isLoading: isPending, error };
};
