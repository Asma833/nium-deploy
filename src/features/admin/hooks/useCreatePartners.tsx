import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import useGetRoleId from '@/hooks/useGetRoleId';
import { UserApiPayload, UserCreationRequest } from '../types/partner.type';
import { useGetProducts } from '@/hooks/useGetProducts';
import { HEADER_KEYS } from '@/core/constant/apis';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { partnerApi } from '../api/partnerApi';

export const useCreatePartner = (
  roleCode: string,
  {
    onUserCreateSuccess,
    productOptions,
  }: {
    onUserCreateSuccess?: (data: UserApiPayload) => void;
    productOptions?: Array<{ id: string; name: string }>;
  }
) => {
  const { getRoleId } = useGetRoleId();
  const roleId = getRoleId(roleCode);
  const { getProductIds } = useGetProducts();
  const productIds = getProductIds() || { card: '', remittance: '' };
  const { getUser } = useCurrentUser();
  const user = getUser();

  const mapFormDataToApiPayload = async (
    formData: UserCreationRequest
  ): Promise<UserApiPayload> => {
    // Determine which product IDs to include
    const product_ids: string[] = [];

    if (formData.productType.both) {
      product_ids.push(productIds.card, productIds.remittance);
    } else {
      if (formData.productType.card) {
        product_ids.push(productIds.card);
      }
      if (formData.productType.remittance) {
        product_ids.push(productIds.remittance);
      }
    }

    return {
      role_id: roleId || '',
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      is_active: formData.isActive ?? true,
      business_type: user?.business_type || '',
      products: product_ids,
      api_key: HEADER_KEYS.API_KEY,
      created_by: user?.created_by || '',
      updated_by: user?.updated_by || '',
    };
  };

  const { mutate, isPending, error } = useMutation<
    void,
    Error,
    UserCreationRequest
  >({
    mutationFn: async (userData: UserCreationRequest) => {
      const apiPayload = await mapFormDataToApiPayload(userData);
      await partnerApi.PartnerCreation(apiPayload);
      onUserCreateSuccess?.(apiPayload);
    },
    onSuccess: () => {
      toast.success('Partner created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Partner creation failed');
    },
  });

  return { mutate, isLoading: isPending, error };
};
