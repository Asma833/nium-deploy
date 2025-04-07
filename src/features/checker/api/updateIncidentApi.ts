import axiosInstance from '@/core/services/axios/axiosInstance';
import { API, HEADER_KEYS } from '@/core/constant/apis';
import {
  EsignLinkRequest,
  UpdateGetRequestData,
  UpdateIncidentRequest,
  UpdateIncidentResponse,
} from '../types/updateIncident.type';

export const updateIncidentApi = {
  updateIncident: async (
    incidentData: UpdateIncidentRequest
  ): Promise<UpdateIncidentResponse> => {
    const { data } = await axiosInstance.put<UpdateIncidentResponse>(
      `${API.CHECKER.UPDATE_INCIDENT.UPDATE}`,
      incidentData
    );
    return data;
  },
  getUpdateIncident: async (
    incidentData: UpdateGetRequestData
  ): Promise<any> => {
    const { data } = await axiosInstance.post<any>(
      `${API.CHECKER.UPDATE_INCIDENT.CHECKER_ORDER}`,
      incidentData
    );
    return data;
  },
  sendEsignLink: async (incidentData: EsignLinkRequest): Promise<any> => {
    const { data } = await axiosInstance.post<any>(
      API.CHECKER.UPDATE_INCIDENT.REGENERATE_ESIGN_LINK,
      incidentData,
      {
        headers: {
          api_key: HEADER_KEYS.API_KEY,
          partner_id: HEADER_KEYS.PARTNER_ID,
        },
      }
    );
    return data;
  },
};
