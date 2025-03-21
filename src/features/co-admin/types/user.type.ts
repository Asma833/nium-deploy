export interface UserCreationRequest {
  role_id:string;
  is_active:boolean;
  hashed_key?:string;
  // first_name?: string;
  // last_name?: string;
  email: string;
  password: string;
  // product_ids?: string[]; 
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
    //  first_name: string;
    //  last_name: string;
     email: string;
     password: string;
    //  product_ids: string[]; 
   }
  
  export interface UserCreationResponse {
    success: boolean;
    message: string;
  }
  
  export interface UserFormData {
    // firstName: string;
    // lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessType: string;
    created_by?: string;
    updated_by?: string;
    // productType: {
    //   card: boolean;
    //   remittance: boolean;
    //   both: boolean;
    // };
  }

  export interface UserRequest {
    role_id: string;
    // firstName: string;
    // lastName: string;
    email: string;
    password: string;
    // confirmPassword: string;
    business_type: string;
    created_by?: string;
    updated_by?: string;
    // product_ids: string[];
    branch_id:string;
    bank_account_id:string;
    role?: string; 
  }
 