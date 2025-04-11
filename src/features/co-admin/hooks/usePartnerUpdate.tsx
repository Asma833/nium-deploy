import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import usePasswordHash from '@/hooks/usePasswordHash';
import { mapProductTypeToIds } from '../utils/productMapping';
import { partnerApi } from '../api/partnerApi';
import { UserCreationRequest } from '../types/partner.type';

interface UpdatePartnerParams {
  data: Omit<UserCreationRequest, 'confirmPassword'>;
  productOptions?: Array<{ id: string; name: string }>;
}

export const usePartnerUpdateAPI = () => {
  const navigate = useNavigate();
  const { hashPassword } = usePasswordHash();
  const { getBankAccountId, getBranchId, getUserHashedKey, getUserId } =
    useCurrentUser();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, productOptions }: UpdatePartnerParams) => {
      // For updates, if no new password is provided, we'll use a placeholder
      // The backend should ignore password updates when this value is used
      const DEFAULT_UPDATE_PASSWORD = 'NO_PASSWORD_UPDATE';

      const hashedValue = data.password
        ? await hashPassword(data.password)
        : DEFAULT_UPDATE_PASSWORD;

      const product_ids = mapProductTypeToIds(data.productType, productOptions);

      const payload = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        hashed_key: getUserHashedKey() || '',
        password: hashedValue, // Now always providing a password value
        updated_by: getUserId() || '',
        product_ids,
        role_id: data.role || '',
        is_active: data.isActive ?? true,
        branch_id: getBranchId() || '',
        bank_account_id: getBankAccountId() || '',
      };

      return await partnerApi.PartnerUpdate(payload);
    },
    onSuccess: () => {
      toast.success('Partners details updated successfully');
      navigate(`/admin/partners`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Partners update failed');
    },
  });

  return { mutate, isLoading: isPending, error };
};
