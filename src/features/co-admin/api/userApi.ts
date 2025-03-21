import axiosInstance from "@/core/services/axios/axiosInstance";
import { getEndpoint } from "@/core/constant/apis";
import { UserCreationRequest, UserCreationResponse, UserRequest, UserUpdateRequest } from "../types/user.type";

export const userApi = {
  userCreation: async (userData: UserRequest): Promise<UserCreationResponse> => {
    const { data } = await axiosInstance.post<UserCreationResponse>(
      getEndpoint("NUSERS.USER.CREATE"),
      userData 
    );
    return data;
  },
  userStatusUpdate: async (userData: UserCreationRequest): Promise<UserUpdateRequest> => {
    const { hashed_key, ...updateData } = userData; 

    const { data } = await axiosInstance.put<UserUpdateRequest>(
      `${getEndpoint("NUSERS.USER.STATUS_UPDATE")}/${hashed_key}`, 
      updateData 
    );

    return data;
},
userUpdate: async (userData: UserCreationRequest): Promise<UserUpdateRequest> => {
  const { hashed_key, ...updateData } = userData; 

  const { data } = await axiosInstance.put<UserUpdateRequest>(
    `${getEndpoint("NUSERS.USER.UPDATE")}/${hashed_key}`, 
    updateData 
  );

  return data;
},


getProducts: async () => {
  const { data } = await axiosInstance.get<UserCreationResponse>(getEndpoint("NUSERS.USER.PRODUCTS"));
  return data; 
},

};
