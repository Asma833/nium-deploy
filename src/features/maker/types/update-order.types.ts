export type UpdateOrderRequest = {
  order_id: string;
  transaction_type: string;
  purpose_type: string;
  is_e_sign_required: boolean;
  is_v_kyc_required: boolean;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_pan: string;
  order_status: string;
  e_sign_status: string;
  e_sign_link: string;
  e_sign_link_status: string;
  e_sign_link_request_id: string;
  e_sign_link_doc_id: string;
  e_sign_link_expires: string;
  e_sign_completed_by_customer: boolean;
  e_sign_customer_completion_date: string;
  e_sign_doc_comments: string;
  v_kyc_profile_id: string;
  v_kyc_reference_id: string;
  v_kyc_status: string;
  v_kyc_link: string;
  v_kyc_link_status: string;
  v_kyc_link_expires: string;
  v_kyc_completed_by_customer: boolean;
  v_kyc_customer_completion_date: string;
  v_kyc_comments: string;
  is_esign_regenerated: boolean;
  is_esign_regenerated_details: {
    reason: string;
  };
  is_video_kyc_link_regenerated: boolean;
  is_video_kyc_link_regenerated_details: {
    reason: string;
  };
  created_by: string;
  updated_by: string;
  checker_id: string;
};

// Partial update type for more flexible updates
export type PartialUpdateOrderRequest = Partial<UpdateOrderRequest>;

export type UpdateOrderResponse = {
  success: boolean;
  message: string;
  data?: any;
};
