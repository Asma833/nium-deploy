import axiosInstance from '@/core/services/axios/axiosInstance';
import { getEndpoint } from '@/core/constant/apis';
import {
  PartnerCreationRequest,
  PartnerCreationResponse,
  PartnerRequest,
  PartnerUpdateRequest,
  ProductResponse,
} from '../types/partner.types';

export const partnerApi = {
  PartnerCreation: async (PartnerData: PartnerRequest): Promise<PartnerCreationResponse> => {
    const { data } = await axiosInstance.post<PartnerCreationResponse>(
      getEndpoint('NUSERS.PARTNERS.CREATE'),
      PartnerData
    );
    return data;
  },
  PartnerStatusUpdate: async (PartnerData: PartnerCreationRequest): Promise<PartnerUpdateRequest> => {
    const { hashed_key, ...updateData } = PartnerData;

    const { data } = await axiosInstance.put<PartnerUpdateRequest>(
      `${getEndpoint('NUSERS.PARTNERS.STATUS_UPDATE')}/${hashed_key}`,
      updateData
    );

    return data;
  },
  PartnerUpdate: async (PartnerData: PartnerCreationRequest): Promise<PartnerUpdateRequest> => {
    const { hashed_key, ...updateData } = PartnerData;

    const { data } = await axiosInstance.put<PartnerUpdateRequest>(
      `${getEndpoint('NUSERS.PARTNERS.UPDATE')}/${hashed_key}`,
      updateData
    );

    return data;
  },

  getProducts: async () => {
    try {
      const { data } = await axiosInstance.get<ProductResponse[]>(getEndpoint('NUSERS.PARTNERS.PRODUCTS'));
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
};
