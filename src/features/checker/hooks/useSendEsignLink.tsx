import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateIncidentApi } from "../api/updateIncidentApi";
import { EsignLinkRequest } from "../types/updateIncident.type";

export const useSendEsignLink  = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation<void, Error, EsignLinkRequest>({
    mutationFn: async (userData:any) => {
      await updateIncidentApi.sendEsignLink(userData);
    },
    onSuccess: () => {
      toast.success("Esign link shared successfully");
      queryClient.invalidateQueries({ queryKey: ["updateIncident"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Esign link sharing failed");
    }
  });

  return { mutate, isLoading: isPending, error };
};
