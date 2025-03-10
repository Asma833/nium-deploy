import { useMutation } from "@tanstack/react-query";
import { updateIncidentApi } from "../api/updateIncidentApi";
import { toast } from "sonner";
import { UpdateIncidentRequest } from "../types/updateIncident.type";

export const useUpdateIncident = () => {
  const { mutate, isPending, error } = useMutation<void, Error, UpdateIncidentRequest>({
    mutationFn: async (incidentData: UpdateIncidentRequest) => {
      await updateIncidentApi.updateIncident(incidentData);
    },
    onSuccess: () => {
      toast.success("Incident updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Incident update failed");
    }
  });

  return { mutate, isLoading: isPending, error };
};
