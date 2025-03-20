import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";
import { toast } from "sonner";
import { UpdateGetRequestData } from "../types/updateIncident.type";

export const useGetUpdateIncident = (incidentData: UpdateGetRequestData) => {
  return useQuery({
    queryKey: ["updateIncident", incidentData],
    
    queryFn: async () => {
      try {
        console.log("Fetching update incident data with:", incidentData); 
        const response = await useApi.getUpdateIncident(incidentData);
        if (!response) {
          throw new Error("Invalid API response");
        }
        return response; 
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch incident data");
        throw error;
      }
    },
    enabled: !!incidentData, 
    
  });
 
};
