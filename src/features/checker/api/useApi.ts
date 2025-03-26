import axiosInstance from "@/core/services/axios/axiosInstance";
import { getEndpoint, HEADER_KEYS } from "@/core/constant/apis";
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

// headers: {
//   api_key: HEADER_KEYS.API_KEY,    // Note: api_key is lowercase while HEADER_KEYS.API_KEY is uppercase
//   partner_id: HEADER_KEYS.PARTNER_ID  // Note: partner_id is lowercase while HEADER_KEYS.PARTNER_ID is uppercase
// },

// headers: {
//   api_key: "7b4d9b49-1794-4a91-826a-749cf0d8a87a",
//   partner_id: "befb8eadb0fac508d695b7395ec10543m8ctxoh9"
// },
