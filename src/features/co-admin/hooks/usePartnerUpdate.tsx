import { useMutation } from "@tanstack/react-query";
import { partnerApi } from "../api/partnerApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/utils/getUserFromRedux";

export const usePartnerUpdateAPI = () => {
  const navigate = useNavigate();
  const { getBankAccountId,getBranchId,getUserHashedKey,getUserId } = useCurrentUser();
 
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, productOptions }: any) => {
      console.log(productOptions,"productOptions")
      debugger;
      const payload = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        hashed_key: getUserHashedKey() || "",
        password: data.password,
        updated_by: getUserId() || "",
        product_ids: Object.keys(data.productType)
          .filter((key) => data.productType[key]) // Only take selected product types
          .map(
            (key) =>
              productOptions?.find(
                (product: any) =>
                  product.name.toLowerCase() === key.toLowerCase()
              )?.id
          ) // Find ID dynamically
          .filter((id) => id),
        role_id: data.roleId,
        is_active: data.isActive,
        branch_id: getBranchId() || "",
        bank_account_id: getBankAccountId() || "",
      };
      console.log(payload)

     // return await partnerApi.PartnerUpdate(payload);
    },
    onSuccess: () => {
      toast.success("Partners details updated successfully");
      navigate(`/admin/partners`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Partners update failed");
    },
  });

  return { mutate, isLoading: isPending, error };
};
