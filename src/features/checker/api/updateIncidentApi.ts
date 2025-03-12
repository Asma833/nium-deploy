import axiosInstance from "@/core/services/axios/axiosInstance";
import { getEndpoint } from "@/core/constant/apis";
import { UpdateIncidentRequest, UpdateIncidentResponse } from "../types/updateIncident.type";

export const updateIncidentApi = {
  updateIncident: async (incidentData: UpdateIncidentRequest): Promise<UpdateIncidentResponse> => {
    const { data } = await axiosInstance.put<UpdateIncidentResponse>(
      getEndpoint("CHECKER.UPDATE_INCIDENT.UPDATE"),incidentData 
    );
    return data;
  },
};
