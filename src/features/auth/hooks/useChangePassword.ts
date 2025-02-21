import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import type { ChangePasswordRequest, ChangePasswordResponse } from "../types/auth.types";
import { useNavigate } from "react-router-dom";

export const useChangePassword = () => {
  const navigate = useNavigate()
  const { mutate, isPending, error } = useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordRequest
  >({
    mutationFn: authApi.changePassword, // API call function
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setTimeout(() => {
        navigate('/login')
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  return { mutate, isLoading: isPending, error };
};
