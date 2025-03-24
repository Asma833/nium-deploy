import { useMutation } from "@tanstack/react-query";
import { partnerApi } from "../api/partnerApi";
import { toast } from "sonner";
import useGetRoleId from "@/hooks/useGetRoleId";

// Form data structure
export interface UserCreationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  hashed_key: string;
  business_type?: string;
  created_by?: string;
  updated_by?: string;
  productType: {
    card: boolean;
    remittance: boolean;
    both: boolean;
  };
  role?: string; 
}

// Expected API payload structure
interface UserApiPayload {
  role_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active: boolean;
  hashed_key: string;
  api_key?: string;
  business_type?: string;
  created_by?: string;
  updated_by?: string;
  product_ids: string[];
}
      
export const useCreatePartner = ( { role }: { role: string },
  {
    onUserCreateSuccess,
  }: { onUserCreateSuccess: (data: UserApiPayload) => void }
) => {
   const { getHashedRoleId } = useGetRoleId();

  // Map product types to product IDs (replace with actual IDs from your system)
  const productMapping = {
    card: "550e8400-e29b-41d4-a716-446655440003",
    remittance: "550e8400-e29b-41d4-a716-446655440004"
  };

  const mapFormDataToApiPayload = (formData: UserCreationRequest): UserApiPayload => {
    // Determine which product IDs to include
    const product_ids: string[] = [];
    if (formData.productType.card) {
      product_ids.push(productMapping.card);
    }
    if (formData.productType.remittance) {
      product_ids.push(productMapping.remittance);
    }

    // Get role ID (default to empty string if not available)
    // const role_id = getRoleId(role) || "";
    const hashed_key = formData.role ? getHashedRoleId(formData.role) : undefined;
    
    return {
      role_id: "cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8",
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      is_active: true,
      hashed_key:hashed_key || '',
      business_type: "large_enterprise",
      product_ids
    };
  };

  const { mutate, isPending, error } = useMutation<void, Error, UserCreationRequest>({
    mutationFn: async (userData: UserCreationRequest) => {
      const apiPayload = mapFormDataToApiPayload(userData);
      await partnerApi.PartnerCreation(apiPayload);
    },
    onSuccess: () => {
      toast.success("Partner created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Partner creation failed");
    }
  });

  return { mutate, isLoading: isPending, error };
};
