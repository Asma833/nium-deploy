import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { useGetProducts } from '@/hooks/useGetProducts';
import { UserCreationRequest } from '../types/partner.types';
import { partnerApi } from '../action/partnerApi';

interface UpdatePartnerParams {
  data: Omit<UserCreationRequest, 'confirmPassword'>;
  productOptions?: Array<{ id: string; name: string }>;
}

export const usePartnerUpdate = () => {
  const navigate = useNavigate();
  const { getBankAccountId, getBranchId, getUserHashedKey, getUserId } =
    useCurrentUser();

  const { getProductIds } = useGetProducts();
  const productIds = getProductIds() || { card: '', remittance: '' };

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, productOptions }: UpdatePartnerParams) => {
      const product_ids: string[] = [];

      if (data.productType.both) {
        product_ids.push(productIds.card, productIds.remittance);
      } else {
        if (data.productType.card) {
          product_ids.push(productIds.card);
        }
        if (data.productType.remittance) {
          product_ids.push(productIds.remittance);
        }
      }

      const payload = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        hashed_key: getUserHashedKey() || '',
        password: data.password,
        updated_by: getUserId() || '',
        products: product_ids || [],
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
