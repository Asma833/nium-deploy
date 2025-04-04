import { useMutation } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { toast } from 'sonner';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { UserFormData } from '../types/user.type';
import { useEffect } from 'react';

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
  const { getBankAccountId, getBranchId } = useCurrentUser();
  const mapFormDataToApiPayload = (
    formData: UserCreationRequest
  ): UserApiPayload => {
    return {
      role_id: 'bcbfc72e-54cc-4f67-9110-342c6570b062',
      email: formData.email,
      password: formData.password,
      is_active: true,
      business_type: 'large_enterprise',
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
      const apiPayload = mapFormDataToApiPayload(userData);
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
