import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { PurposeApiPayload } from '../types/purpose.types';
import { purposeMasterApi } from '../action/purposeMasterApi';

export const useCreatePurposeMaster = ({
  onPurposeCreateSuccess,
}: {
  onPurposeCreateSuccess: (data: PurposeApiPayload) => void;
}) => {
  const navigate = useNavigate();
  const mapFormDataToApiPayload = async (formData: PurposeApiPayload): Promise<PurposeApiPayload> => {
    return {
      purpose_name: formData.purpose_name,
      purpose_code: formData.purpose_code,
    };
  };

  const { mutate, isPending, error } = useMutation<PurposeApiPayload, Error, PurposeApiPayload>({
    mutationFn: async (purposeData: PurposeApiPayload) => {
      const apiPayload = await mapFormDataToApiPayload(purposeData);
      await purposeMasterApi.purposeMasterCreation(apiPayload);
      return apiPayload;
    },
    onSuccess: (data: PurposeApiPayload) => {
      toast.success('Purpose created successfully');
      onPurposeCreateSuccess(data);

      navigate('/admin/master/purpose-master');
    },
    onError: (error: Error) => {
      if (error && typeof (error as any).status === 'number' && (error as any).status === 409) {
        toast.error('Purpose with the same code already exists');
      } else {
        toast.error(error.message || 'Purpose creation failed');
      }
    },
  });

  return { mutate, isLoading: isPending, error };
};
