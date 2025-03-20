import { useSelector } from 'react-redux';

interface BankAccount {
  id: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  bank_branch: string;
}

interface Branch {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  hashed_key: string;
  is_active: boolean;
  business_type: string;
  created_by: string | null;
  updated_by: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
  branch: Branch;
  bank_account: BankAccount;
}

interface AuthState {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RootState {
  auth: AuthState;
}

export const useCurrentUser = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const getUserHashedKey = (): string | undefined => {
    return user?.hashed_key;
  };
  
  const getUserRole = (): string | undefined => {
    return user?.role.name;
  };
  
  const getUserId = (): string | undefined => {
    return user?.id;
  };
  
  const getUserEmail = (): string | undefined => {
    return user?.email;
  };
  
  const getBranchId = (): string | undefined => {
    return user?.branch.id;
  };
  const getBankAccountId = (): string | undefined => {
    return user?.bank_account.id;
  };
  
  return {
    user,
    getUserHashedKey,
    getUserRole,
    getUserId,
    getUserEmail,
    getBranchId,
    getBankAccountId
  };
};
