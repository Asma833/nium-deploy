import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { userApi } from '../action/userApi';
import useGetRoleId from '@/hooks/useGetRoleId';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

export const useUpdateAPI = () => {
  const navigate = useNavigate();
  const { getRoleId } = useGetRoleId();
  const roleId = getRoleId('checker');
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { getBankAccountId, getBranchId } = useCurrentUser();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, id }: any) => {
      const payload = {
        email: data.email,
        hashed_key: id,
        password: data.password,
        role_id: roleId || '',
        branch_id: getBranchId() || '',
        bank_account_id: getBankAccountId() || '',
        business_type: 'large_enterprise',
        updated_by: userId || '',
      };

      return await userApi.userUpdate(payload);
    },
    onSuccess: () => {
      toast.success('User details updated successfully');
      navigate(`/admin/users`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'User update failed');
    },
  });

  return { mutate, isLoading: isPending, error };
};
