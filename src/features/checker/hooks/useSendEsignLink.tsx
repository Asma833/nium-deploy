import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApi } from "../api/useApi";
import { EsignLinkRequest } from "../types/updateIncident.type";

export const useSendEsignLink  = () => {
  const { mutate, isPending, error } = useMutation<void, Error, EsignLinkRequest>({
    mutationFn: async (userData:any) => {
      await useApi.sendEsignLink(userData);
    },
    onSuccess: () => {
      toast.success("Esign link shared successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Esign link sharing failed");
    }
  });

  return { mutate, isLoading: isPending, error };
};
