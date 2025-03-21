import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { toast } from "sonner";
//import useGetRoleId from "@/hooks/useGetRoleId";
import { useCurrentUser } from "@/utils/getUserFromRedux";

// Form data structure
export interface UserCreationRequest {
  // firstName: string;
  // lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  // hashed_key: string;
  business_type: string;
  created_by?: string;
  updated_by?: string;
  // productType: {
  //   card: boolean;
  //   remittance: boolean;
  //   both: boolean;
  // };
  role?: string;
  branch_id:string;
  bank_account_id:string;
}

// Expected API payload structure
interface UserApiPayload {
  role_id: string;
  email: string;
  // first_name: string;
  // last_name: string;
  password: string;
  is_active: boolean;
  // hashed_key?: string;
  // api_key?: string;
  business_type: string;
  created_by?: string;
  updated_by?: string;
  // product_ids: string[];
  branch_id:string;
  bank_account_id:string;
}

export const useCreateUser = ({role}: {role: string}) => {
  //  const { getRoleId, getHashedRoleId } = useGetRoleId();
  //const { getRoleId } = useGetRoleId();
   const { getBankAccountId, getBranchId } = useCurrentUser();
   console.log("getBankAccountId",role, getBankAccountId());
  // Map product types to product IDs (replace with actual IDs from your system)
  // const productMapping = {
  //   card: "550e8400-e29b-41d4-a716-446655440003",
  //   remittance: "550e8400-e29b-41d4-a716-446655440004"
  // };

  const mapFormDataToApiPayload = (formData: UserCreationRequest): UserApiPayload => {
    // Determine which product IDs to include
    //const product_ids: string[] = [];
    // if (formData.productType.card) {
    //   product_ids.push(productMapping.card);
    // }
    // if (formData.productType.remittance) {
    //   product_ids.push(productMapping.remittance);
    // }

    // Get role ID (default to empty string if not available)
   // const role_id = getRoleId(role) || "";
    //const hashed_key = formData.role ? getHashedRoleId(formData.role) : undefined;
    
    return {
      // role_id,
      // role_id:"cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8",
      role_id:"bcbfc72e-54cc-4f67-9110-342c6570b062",
      email: formData.email,
      // first_name: formData.firstName,
      // last_name: formData.lastName,
      password: formData.password,
      is_active: true,
      // hashed_key:hashed_key || '',
      business_type: "large_enterprise",
      // product_ids : ["550e8400-e29b-41d4-a716-446655440003"],
      //product_ids,
      // branch_id: "aae5704d-f397-4cfb-8994-bb0823f50cd2",
      // bank_account_id: "6d3bbdeb-6330-4e09-b661-847065296c9b"
       branch_id: getBranchId() || "",
      bank_account_id: getBankAccountId() || ""
    };
  };

  const { mutate, isPending, error } = useMutation<void, Error, UserCreationRequest>({
    mutationFn: async (userData: UserCreationRequest) => {
      const apiPayload = mapFormDataToApiPayload(userData);
     // console.log(apiPayload,"apiPayload")
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
