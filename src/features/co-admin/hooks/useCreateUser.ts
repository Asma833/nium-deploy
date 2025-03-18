import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { toast } from "sonner";
import useGetRoleId from "@/hooks/useGetRoleId";

// Form data structure
export interface UserCreationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  hashed_key?: string | undefined;
  api_key?: string;
  business_type?: string;
  created_by?: string;
  updated_by?: string;
  product_ids: string[];
}

export const useCreateUser = ({role}: {role: string}) => {
  const { getRoleId, getHashedRoleId } = useGetRoleId();

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
    const role_id = getRoleId(role) || "";
    const hashed_key = formData.role ? getHashedRoleId(formData.role) : undefined;
    
    return {
      role_id,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      is_active: true,
      hashed_key,
      business_type: "large_enterprise",
      product_ids
    };
  };

  const { mutate, isPending, error } = useMutation<void, Error, UserCreationRequest>({
    mutationFn: async (userData: UserCreationRequest) => {
      const apiPayload = mapFormDataToApiPayload(userData);
      await userApi.userCreation(apiPayload);
    },
    onSuccess: () => {
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "User creation failed");
    }
  });

  return { mutate, isLoading: isPending, error };
};
