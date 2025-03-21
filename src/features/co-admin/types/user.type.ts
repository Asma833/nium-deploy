export interface UserCreationRequest {
  role_id:string;
  is_active:boolean;
  hashed_key?:string;
  email: string;
  password: string;
  business_type?: string,
  branch_id: string,
  bank_account_id: string;
  }
  export interface UserStatusRequest {
    is_active:boolean;
    hashed_key:string;
  }
  export interface UserUpdateRequest {
     hashed_key:string;
     email: string;
     password: string;
   }
  
  export interface UserCreationResponse {
    success: boolean;
    message: string;
  }
  
  export interface UserFormData {
    email: string;
    password: string;
    confirmPassword: string;
    businessType: string;
    created_by?: string;
    updated_by?: string;
  }

  export interface UserRequest {
    role_id: string;
    email: string;
    password: string;
    business_type: string;
    created_by?: string;
    updated_by?: string;
    branch_id:string;
    bank_account_id:string;
    role?: string; 
  }
 