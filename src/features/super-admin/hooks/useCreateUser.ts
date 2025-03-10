import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { toast } from "sonner";
import { UserCreationRequest } from "../types/user.type";

export const useCreateUser = () => {
  const { mutate, isPending, error } = useMutation<void, Error, UserCreationRequest>({
    mutationFn: async (userData: UserCreationRequest) => {
      await userApi.userCreation(userData);
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
