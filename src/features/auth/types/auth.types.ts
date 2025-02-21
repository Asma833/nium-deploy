export enum Role {
  ADMIN = "admin",
  CO_ADMIN = "co-admin",
  MAKER = "maker",
  CHECKER = "checker",
}

export type Permission =
  | "view_dashboard"
  | "manage_agents"
  | "view_transactions"
  | "approve_transactions";

export type UserRole = 'admin' | 'co-admin' | 'maker' | 'checker';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  token:string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string; 
}