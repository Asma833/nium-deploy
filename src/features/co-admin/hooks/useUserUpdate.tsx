import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/utils/getUserFromRedux";

export const useUpdateAPI = () => {
  const navigate = useNavigate();
  const { getBankAccountId, getBranchId } = useCurrentUser();
 // const currentUserHashedKey = getUserHashedKey();
 
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, id }: any) => {
      //console.log(data,"data")
      const payload = {
        email: data.email,
        // first_name: data.firstName,
        // last_name: data.lastName,
        hashed_key: id,
        password: data.password,
        // updated_by: currentUserHashedKey,
        // product_ids: Object.keys(data.productType)
        //   .filter((key) => data.productType[key]) // Only take selected product types
        //   .map(
        //     (key) =>
        //       productOptions?.find(
        //         (product: any) =>
        //           product.name.toLowerCase() === key.toLowerCase()
        //       )?.id
        //   ) // Find ID dynamically
        //   .filter((id) => id),
        role_id: "bcbfc72e-54cc-4f67-9110-342c6570b062",
        is_active: true,
        branch_id: getBranchId() || "",
        bank_account_id: getBankAccountId() || "",
        business_type: "large_enterprise"
      };

      return await userApi.userUpdate(payload);
    },
    onSuccess: () => {
      toast.success("User details updated successfully");
      navigate(`/admin/users`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "User update failed");
    },
  });

  return { mutate, isLoading: isPending, error };
};
