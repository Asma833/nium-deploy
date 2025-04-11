import { useMutation } from '@tanstack/react-query';
import { partnerApi } from '../api/partnerApi';
import { toast } from 'sonner';
import useGetRoleId from '@/hooks/useGetRoleId';
import usePasswordHash from '@/hooks/usePasswordHash';
import { mapProductTypeToIds } from '../utils/productMapping';
import { UserApiPayload, UserCreationRequest } from '../types/partner.type';

// Form data structure

export const useCreatePartner = (
  { role }: { role: string },
  {
    onUserCreateSuccess,
    productOptions,
  }: {
    onUserCreateSuccess?: (data: UserApiPayload) => void;
    productOptions?: Array<{ id: string; name: string }>;
  }
) => {
  const { getHashedRoleId } = useGetRoleId();
  const { hashPassword } = usePasswordHash();

  const productMapping = {
    card: '550e8400-e29b-41d4-a716-446655440003',
    remittance: '550e8400-e29b-41d4-a716-446655440004',
  };

  const mapFormDataToApiPayload = async (
    formData: UserCreationRequest
  ): Promise<UserApiPayload> => {
    const hashedValue = await hashPassword(formData.password);

    const hashed_key = formData.role
      ? getHashedRoleId(formData.role)
      : undefined;

    // Determine which product IDs to include
    const product_ids: string[] = [];
    if (formData.productType.card) {
      product_ids.push(productMapping.card);
    }
    if (formData.productType.remittance) {
      product_ids.push(productMapping.remittance);
    }

    return {
      role_id: 'cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8', // TODO: Make this dynamic
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: hashedValue,
      is_active: formData.isActive ?? true,
      hashed_key: hashed_key || '',
      business_type: formData.business_type || 'large_enterprise',
      product_ids,
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
