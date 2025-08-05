export type PartnerCreationRequest = {
  role_id: string;
  is_active: boolean;
  hashed_key: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  branch_id: string;
  bank_account_id: string;
  created_by?: string;
  updated_by?: string;
  product_ids?: string[];
  products?: string[];
};
export type PartnerStatusRequest = {
  is_active: boolean;
  hashed_key: string;
};
export type PartnerUpdateRequest = {
  hashed_key: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  product_ids: string[];
};

export type PartnerCreationResponse = {
  success: boolean;
  message: string;
};

export type PartnerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessType: string;
  productType: {
    card: boolean;
    remittance: boolean;
    both: boolean;
  };
};

export type PartnerRequest = {
  role_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active?: boolean;
  hashed_key?: string;
  api_key?: string;
  business_type?: string;
  created_by?: string;
  updated_by?: string;
  product_ids?: string[];
  products?: string[];
};
export type PartnerApiPayload = {
  role_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active?: boolean;
  hashed_key?: string;
  api_key?: string;
  business_type?: string;
  created_by?: string;
  updated_by?: string;
  product_ids?: string[];
  products?: string[];
};

export type UserCreationRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  hashed_key?: string;
  business_type?: string;
  created_by?: string;
  updated_by?: string;
  products?: string[];
  productType: {
    card: boolean;
    remittance: boolean;
    both: boolean;
  };
  role?: string;
  isActive?: boolean;
};

// Expected API payload structure
export type UserApiPayload = {
  role_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active?: boolean;
  hashed_key?: string;
  api_key?: string;
  business_type?: string;
  created_by?: string;
  updated_by?: string;
  product_ids?: string[];
  products?: string[];
};

export type ProductResponse = {
  id: string;
  name: string;
};
