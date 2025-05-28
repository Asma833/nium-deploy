import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '../action/userApi';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import useGetRoleId from '@/hooks/useGetRoleId';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserApiPayload, UserCreationRequest } from '../types/admin.types';
// Form data structure

export const useCreateUser = (
  { role }: { role: string },
  {
    onUserCreateSuccess,
  }: { onUserCreateSuccess: (data: UserApiPayload) => void }
) => {
  const navigate = useNavigate();
  const { getRoleId } = useGetRoleId();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { getBankAccountId, getBranchId, getBusinessType } = useCurrentUser();
  const mapFormDataToApiPayload = async (
    formData: UserCreationRequest
  ): Promise<UserApiPayload> => {
    const roleId = getRoleId('checker');
    return {
      role_id: roleId || '',
      email: formData.email,
      password: formData.password,
      is_active: true,
      business_type: getBusinessType() || '',
      branch_id: getBranchId() || '',
      bank_account_id: getBankAccountId() || '',
      created_by: userId || '',
    };
  };

  const { mutate, isPending, error } = useMutation<
    UserApiPayload,
    Error,
    UserCreationRequest
  >({
    mutationFn: async (userData: UserCreationRequest) => {
      const apiPayload = await mapFormDataToApiPayload(userData);
      await userApi.userCreation(apiPayload);
      return apiPayload;
    },
    onSuccess: (data: UserApiPayload) => {
      toast.success('User created successfully');
      onUserCreateSuccess(data);
      navigate('/admin/users');
    },
    onError: (error: Error) => {
      toast.error(
        error.message === 'Request failed with status code 409'
          ? 'Email already exist'
          : error.message || 'User creation failed'
      );
    },
  });

  return { mutate, isLoading: isPending, error };
};
