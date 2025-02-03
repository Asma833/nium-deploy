import axiosInstance from "@/core/services/axios/axiosInstance";
import { LoginResponse, User, UserRole } from "../types/auth.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  loginUser: async ({
    email,
    password,
  }: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    
    // Ensure the role is of type UserRole
    const user: User = {
      ...data.user,
      role: data.user.role.toLowerCase() as UserRole
    };

    return {
      ...data,
      user
    };
  },
  logoutUser: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },
  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post("/auth/forgot-password", { email });
  },
};
