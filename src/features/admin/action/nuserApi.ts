import { API } from '@/core/constant/apis';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { NuserPayload } from '../types/user.types';

export const nuserApi = {
  userCreation: async (userData: NuserPayload): Promise<NuserPayload> => {
    const { data } = await axiosInstance.post<NuserPayload>(API.NUSERS.USER.CREATE, userData);
    return data;
  },
  userStatusUpdate: async (userData: NuserPayload): Promise<NuserPayload> => {
    const { hashed_key, ...updateData } = userData;

    const { data } = await axiosInstance.put<NuserPayload>(
      API.NUSERS.USER.STATUS_UPDATE + `/${hashed_key}`,
      updateData
    );

    return data;
  },
};
