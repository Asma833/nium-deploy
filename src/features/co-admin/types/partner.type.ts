export interface PartnerCreationRequest {
    role_id:string;
    is_active:boolean;
    hashed_key:string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    product_ids: string[];
    branch_id:string;
    bank_account_id:string;
    }
    export interface PartnerStatusRequest {
      is_active:boolean;
      hashed_key:string;
    }
    export interface PartnerUpdateRequest {
       hashed_key:string;
       first_name: string;
       last_name: string;
       email: string;
       password: string;
       product_ids: string[]; 
     }
    
    export interface PartnerCreationResponse {
      success: boolean;
      message: string;
    }
    
    export interface PartnerFormData {
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
    }
  
    export interface PartnerRequest {
        role_id: string;
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        is_active: boolean;
        hashed_key: string;
        api_key?: string;
        business_type?: string;
        created_by?: string;
        updated_by?: string;
        product_ids: string[];
    }
    export interface PartnerApiPayload {
      role_id: string;
      email: string;
      first_name: string;
      last_name: string;
      password: string;
      is_active: boolean;
      hashed_key: string;
      api_key?: string;
      business_type?: string;
      created_by?: string;
      updated_by?: string;
      product_ids: string[];
    }