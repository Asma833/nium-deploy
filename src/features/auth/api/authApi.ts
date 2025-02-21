import axiosInstance from "@/core/services/axios/axiosInstance";
import { ChangePasswordResponse, LoginResponse, User, UserRole } from "../types/auth.types";
import { getEndpoint } from "@/core/constant/apis";

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
  token:string;
}

export const authApi = {
  loginUser: async ({
    email,
    password,
  }: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>(
      getEndpoint('AUTH.LOGIN'),
      { email, password }
    );

    if (!data.access_token || !data.refresh_token || !data.user) {
      throw new Error('Invalid login response');
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    return data;
  },
  logoutUser: async (): Promise<void> => {
    await axiosInstance.post(getEndpoint('AUTH.LOGOUT'));
  },
  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post(getEndpoint('AUTH.FORGOT_PASSWORD'), { email });
  },
  changePassword: async ({newPassword, confirmPassword,token }: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const { data } = await axiosInstance.post(getEndpoint("AUTH.CHANGE_PASSWORD"), {newPassword, confirmPassword,token });
    return data;
  },
};
