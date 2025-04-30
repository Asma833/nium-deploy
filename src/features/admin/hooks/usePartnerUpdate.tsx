import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { mapProductTypeToIds } from '../utils/productMapping';
import { partnerApi } from '../api/partnerApi';
import { UserCreationRequest } from '../types/partner.type';

interface UpdatePartnerParams {
  data: Omit<UserCreationRequest, 'confirmPassword'>;
  productOptions?: Array<{ id: string; name: string }>;
}

export const usePartnerUpdateAPI = () => {
  const navigate = useNavigate();
  const { getBankAccountId, getBranchId, getUserHashedKey, getUserId } =
    useCurrentUser();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, productOptions }: UpdatePartnerParams) => {
      const product_ids = mapProductTypeToIds(data.productType, productOptions);

      const payload = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        hashed_key: getUserHashedKey() || '',
        password: data.password,
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
