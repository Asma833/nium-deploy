import axiosInstance from "@/core/services/axios/axiosInstance";
import { getEndpoint } from "@/core/constant/apis";
import { UserCreationRequest, UserCreationResponse } from "../types/user.type";

export const userApi = {
  userCreation: async (userData: UserCreationRequest): Promise<UserCreationResponse> => {
    const { data } = await axiosInstance.post<UserCreationResponse>(
      getEndpoint("NUSER.CREATE"),
      userData 
    );
    return data;
  },
};
