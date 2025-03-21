import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/core/services/axios/axiosInstance";
import { toast } from "sonner";

interface UnassignCheckerParams {
  orderId: string;
  checkerId: string;
}

const useUnassignChecker = () => {
  const queryClient = useQueryClient();
  
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (params: UnassignCheckerParams) => {
      const response = await axiosInstance.post(
        "/orders/unassign-checker",
        params
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Checker unassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["updateIncident"] });
    },
    onError: (error) => {
      toast.error("Failed to unassign checker");
    },
  });

  const handleUnassign = (orderId: string, checkerId: string) => {
    mutate({
      orderId,
      checkerId,
    });
  };

  return {
    handleUnassign,
    isPending,
    isError,
    isSuccess,
  };
};

export default useUnassignChecker;
