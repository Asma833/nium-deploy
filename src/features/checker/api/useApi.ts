import axiosInstance from "@/core/services/axios/axiosInstance";
import { getEndpoint } from "@/core/constant/apis";
import { UpdateGetRequestData, UpdateIncidentRequest, UpdateIncidentResponse } from "../types/updateIncident.type";

export const useApi = {
  updateIncident: async (incidentData: UpdateIncidentRequest): Promise<UpdateIncidentResponse> => {
    const { data } = await axiosInstance.put<UpdateIncidentResponse>(
      getEndpoint("CHECKER.UPDATE_INCIDENT.UPDATE"),incidentData 
    );
    return data;
  },
  getUpdateIncident: async (incidentData: UpdateGetRequestData): Promise<any> => {
    const { data } = await axiosInstance.post<any>(
      getEndpoint("CHECKER.UPDATE_INCIDENT.CHECKER_ORDER"),incidentData 
    );
    return data;
  },
};
