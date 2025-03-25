import axiosInstance from "@/core/services/axios/axiosInstance";
import { getEndpoint } from "@/core/constant/apis";
import { EsignLinkRequest, UpdateGetRequestData, UpdateIncidentRequest, UpdateIncidentResponse } from "../types/updateIncident.type";

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
  sendEsignLink: async (incidentData: EsignLinkRequest): Promise<any> => {
    const { data } = await axiosInstance.post<any>(
      getEndpoint("CHECKER.UPDATE_INCIDENT.REGENERATE_ESIGN_LINK"),
      incidentData,
      {
        headers: {
          api_key: "7b4d9b49-1794-4a91-826a-749cf0d8a87a",
          partner_id: "befb8eadb0fac508d695b7395ec10543m8ctxoh9"
        },
      }
    );
    return data;
  },
  
};
