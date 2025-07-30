import { Role } from "@/types/enums";

export type Permission = 'view_dashboard' | 'manage_agents' | 'view_transactions' | 'approve_transactions';

export type UserRole = 'admin' | 'maker' | 'checker';

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  business_type: string;
  createdAt: string;
  updatedAt: string;
  created_by: string;
  updated_by: string;
  role: {
    id: string;
    name: Role;
  };
  branch: {
    id: string;
    name: string;
  } | null;
  bankAccount: any | null;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
