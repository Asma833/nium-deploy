export enum FieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Time = 'time',
  Phone = 'phone',
  IndianPhone = 'indian_phone',
  TextArea = 'textarea',
  Radio = 'radio',
  RadioGroup = 'radio_group',
  PasswordConfirm = 'password_confirm',
  PasswordStrength = 'password_strength',
  PasswordStrengthConfirm = 'password_strength_confirm',
  Hidden = 'hidden',
  Color = 'color',
  RichText = 'rich_text',
  RichTextArea = 'rich_text_area',
  Email = 'email',
  Password = 'password',
  Select = 'select',
  Checkbox = 'checkbox',
  FileUpload = 'fileupload',
  Fileupload_View = 'fileupload_view',
  FileUploadWithButton = 'fileupload_with_button',
}

export type FormField = {
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
};

export type TransactionOrderData = {
  id?: string;
  hashed_key?: string;
  partner_id?: string;
  partner_order_id?: string;
  transaction_type?: string;
  purpose_type?: string;
  is_esign_required?: boolean;
  is_v_kyc_required?: boolean;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_pan?: string;
  order_status?: string;
  e_sign_status?: string;
  e_sign_link?: string;
  e_sign_link_status?: string;
  e_sign_link_doc_id?: string;
  e_sign_link_request_id?: string;
  e_sign_link_expires?: string;
  e_sign_completed_by_customer?: string | null;
  e_sign_customer_completion_date?: string;
  e_sign_doc_comments?: string | null;
  v_kyc_reference_id?: string | null;
  v_kyc_profile_id?: string | null;
  v_kyc_status?: string;
  v_kyc_link?: string | null;
  v_kyc_link_status?: string | null;
  v_kyc_link_expires?: string | null;
  v_kyc_completed_by_customer?: string | null;
  v_kyc_customer_completion_date?: string;
  v_kyc_comments?: string | null;
  incident_status?: boolean;
  incident_checker_comments?: string;
  nium_order_id?: string;
  nium_invoice_number?: string;
  date_of_departure?: string | null;
  incident_completion_date?: string;
  is_esign_regenerated?: boolean;
  is_esign_regenerated_details?: string | null;
  is_video_kyc_link_regenerated?: boolean;
  is_video_kyc_link_regenerated_details?: string | null;
  created_by?: string;
  updated_by?: string;
  checker_id?: string;
  merged_document?: {
    url?: string;
    size?: number;
    mimeType?: string;
    created_at?: string;
    documentIds?: string[];
  };
  created_at?: string;
  esigns?: {
    id?: string;
    hashed_key?: string;
    partner_order_id?: string;
    order_id?: string;
    attempt_number?: number;
    task_id?: string;
    group_id?: string;
    esign_file_details?: {
      file_name?: string;
      esign_file?: string;
      esign_fields?: {
        esign_fields?: Record<string, unknown>;
      };
      esign_allow_fill?: boolean;
      esign_profile_id?: string;
      esign_additional_files?: any[];
    };
    esign_stamp_details?: {
      esign_stamp_value?: string;
      esign_series_group?: string;
      esign_stamp_series?: string;
    };
    esign_invitees?: {
      esigner_name?: string;
      esigner_email?: string;
      esigner_phone?: string;
      aadhaar_esign_verification?: {
        aadhaar_yob?: string;
        aadhaar_gender?: string;
        aadhaar_pincode?: string;
      };
    }[];
    esign_details?: {
      status?: string;
      esign_doc_id?: string;
      esign_details?: {
        esign_url?: string | null;
        url_status?: boolean;
        esign_expiry?: string | null;
        esigner_name?: string | null;
        esigner_email?: string | null;
        esigner_phone?: string | null;
      }[];
      esigner_details?: unknown;
    };
    esign_doc_id?: string;
    status?: string;
    request_id?: string;
    completed_at?: string;
    esign_expiry?: string;
    active?: boolean;
    expired?: boolean;
    rejected?: boolean;
    result?: unknown;
    esigners?: {
      esigner_name?: string;
      esigner_state?: string;
      esigner_title?: string;
      esigner_pincode?: string;
    }[];
    file_details?: {
      audit_file?: string;
      esign_file?: string[];
    };
    request_details?: {
      esign_url?: string;
      is_active?: boolean;
      is_signed?: boolean;
      esign_type?: string;
      is_expired?: boolean;
      expiry_date?: string;
      is_rejected?: boolean;
      esigner_name?: string;
      esigner_email?: string;
      esigner_phone?: string;
    }[];
    esign_irn?: string | null;
    esign_folder?: string | null;
    esign_type?: string;
    esign_url?: string;
    esigner_email?: string;
    esigner_phone?: string;
    is_signed?: boolean;
    type?: string | null;
    created_by?: string;
    updated_by?: string;
  }[];
  vkycs?: any[];
  transaction_type_name?: {
    id?: string;
    name?: string;
    hashed_key?: string;
  };
  purpose_type_name?: {
    id?: string;
    purpose_name?: string;
  };
};
