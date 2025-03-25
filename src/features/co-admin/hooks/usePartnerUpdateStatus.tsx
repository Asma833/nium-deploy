import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserStatusRequest } from "../types/user.type";
import { partnerApi } from "../api/partnerApi";

export const usePartnerStatusUpdateAPI  = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation<void, Error, UserStatusRequest>({
    mutationFn: async (userData:any) => {
      await partnerApi.PartnerUpdate(userData);
    },
    onSuccess: () => {
      toast.success("User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userStatusUpdate"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Status update failed");
    }
  });

  return { mutate, isLoading: isPending, error };
};
