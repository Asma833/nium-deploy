export interface UserCreationRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    productType: string[]; 
  }
  
  
  export interface UserCreationResponse {
    success: boolean;
    message: string;
  }