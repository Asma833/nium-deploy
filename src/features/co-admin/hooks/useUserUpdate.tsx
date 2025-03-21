import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/utils/getUserFromRedux";

export const useUpdateAPI = () => {
  const navigate = useNavigate();
  const { getBankAccountId, getBranchId } = useCurrentUser();
 
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, id }: any) => {
      const payload = {
        email: data.email,
        hashed_key: id,
        password: data.password,
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
