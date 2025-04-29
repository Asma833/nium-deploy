import { useMutation } from '@tanstack/react-query';
import { partnerApi } from '../api/partnerApi';
import { toast } from 'sonner';
import useGetRoleId from '@/hooks/useGetRoleId';
import usePasswordHash from '@/hooks/usePasswordHash';
import { mapProductTypeToIds } from '../utils/productMapping';
import { UserApiPayload, UserCreationRequest } from '../types/partner.type';
import { useGetProducts } from '@/hooks/useGetProducts';

// Form data structure

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
  const { getHashedRoleId, getRoleId } = useGetRoleId();
  const { hashPassword } = usePasswordHash();
  const roleId = getRoleId(roleCode);
  const { getProductIds } = useGetProducts();
  const productIds = getProductIds() || { card: '', remittance: '' };

  const mapFormDataToApiPayload = async (
    formData: UserCreationRequest
  ): Promise<UserApiPayload> => {
    const hashedValue = await hashPassword(formData.password);

    const hashed_key = formData.role
      ? getHashedRoleId(formData.role)
      : undefined;

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
      business_type: formData.business_type || 'large_enterprise',
      products: product_ids,
      api_key: HEADER_KEYS.API_KEY,
      created_by: '5177b708-19ee-4f82-aaf1-1c6e1ddbefff',
      updated_by: '5177b708-19ee-4f82-aaf1-1c6e1ddbefff',
    };
    // return {
    //   role_id: roleId || '',
    //   email: formData.email,
    //   first_name: formData.firstName,
    //   last_name: formData.lastName,
    //   password: hashedValue,
    //   is_active: formData.isActive ?? true,
    //   hashed_key: hashed_key || '',
    //   business_type: formData.business_type || 'large_enterprise',
    //   product_ids,
    // };
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
