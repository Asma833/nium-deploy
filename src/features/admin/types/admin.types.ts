export type UserCreationRequest = {
  email: string;
  password: string;
  confirmPassword?: string;
  business_type: string;
  created_by?: string;
  updated_by?: string;
  role?: string;
  branch_id: string;
  bank_account_id: string;
};

// Expected API payload structure
export type UserApiPayload = {
  role_id: string;
  email: string;
  password: string;
  is_active: boolean;
  business_type: string;
  created_by?: string;
  updated_by?: string;
  branch_id: string;
  bank_account_id: string;
};

export type TableTabsLayoutNavProps = {
  label: string;
  path: string;
};

export type TableTabsLayoutProps = {
  children: React.ReactNode;
  tabs?: TableTabsLayoutNavProps[];
  customNavigate?: (path: string) => void;
};
