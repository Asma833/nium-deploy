import { useMutation } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { toast } from 'sonner';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import useGetRoleId from '@/hooks/useGetRoleId';
// Form data structure
export interface UserCreationRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  business_type: string;
  created_by?: string;
  updated_by?: string;
  role?: string;
  branch_id: string;
  bank_account_id: string;
}

// Expected API payload structure
interface UserApiPayload {
  role_id: string;
  email: string;
  password: string;
  is_active: boolean;
  business_type: string;
  created_by?: string;
  updated_by?: string;
  branch_id: string;
  bank_account_id: string;
}

export const useCreateUser = (
  { role }: { role: string },
  {
    onUserCreateSuccess,
  }: { onUserCreateSuccess: (data: UserApiPayload) => void }
) => {
  const { getRoleId } = useGetRoleId();
  const { getBankAccountId, getBranchId, getBusinessType} = useCurrentUser();
  const mapFormDataToApiPayload = async (
    formData: UserCreationRequest
  ): Promise<UserApiPayload> => {
     const roleId = getRoleId(role);
    return {
      role_id: roleId || '',
      email: formData.email,
      password: formData.password,
      is_active: true,
      business_type: getBusinessType() || '',
      branch_id: getBranchId() || '',
      bank_account_id: getBankAccountId() || '',
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
