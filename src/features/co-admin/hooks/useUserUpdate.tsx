import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useUpdateAPI = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, productOptions, id }: any) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      //console.log(data,"data")
      const payload = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        hashed_key: id || "",
        password: data.password,
        updated_by: user.id,
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
        branch_id: data.branchId || '',
        bank_account_id: data.bankAccountId || '',
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
