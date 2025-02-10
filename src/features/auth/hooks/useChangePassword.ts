import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import type { ChangePasswordRequest, ChangePasswordResponse } from "../types/auth.types";

export const useChangePassword = () => {
  const { mutate, isPending, error } = useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordRequest
  >({
    mutationFn: authApi.changePassword, // API call function
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  return { mutate, isLoading: isPending, error };
};
